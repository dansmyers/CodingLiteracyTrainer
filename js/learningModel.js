//*** Constructor and functions for LearningModel ***//

// LearningModel represents a category of problems with similar
// characteristics.
//
// The number of correct and incorrect responses to
// problems generated from the class are tracked and used to
// calculate the class's *learning score*, a measure of how well the
// user is mastering the concepts represented by the LearningModel.


//*** Constructs a new LearningModel object ***//
var LearningModel =  function() {
  
  // There are six basic language features:
  //   1. assignments
  //   2. if
  //   3. if-else
  //   4. for loops
  //   5. while loops
  //   6. functions
  //
  // Only assignments are initially unlocked
  this.numFeatures = 1;
  
  // Number of correct and incorrect responses for language features
  this.scores = [];
  var obj = {'feature': 1, 'correct': 0, 'incorrect': 0};
  this.scores.push(obj);
  
  // Learning model paramters
  this.LEARNING_RATE = 1.5;
  this.maxNumber = 2;
  
  // Default problem generation parameters
  this.numVariables = 2;
  this.maxStatements = 2;

  this.ifAllowed = false;
  this.ifElseAllowed = false;
  this.maxStatementsInConditional = 1;
  this.maxLogicalLevel = 1;
  
  this.forAllowed = false;
  this.whileAllowed = false;

  this.functionAllowed = false;
  this.maxFunctionLevel = 1;
  this.maxFunctionVariables = 3;
  this.maxNumFunctions = 1;
  this.maxFunctionArgs = 0;
}


//*** Calculates the current learning score for a class ***//
//
// The learning score is a measure between 0.0 and 1.0 indicating
// how well the user is mastering the concepts of this class.
//
// The calculation is based on a logistic function.
//
// Returns: the score calculated from numCorrect and numIncorrect
LearningModel.prototype.learningScore = function(feature) {
  var diff = feature.correct - feature.incorrect;
  var e = Math.exp(-this.LEARNING_RATE * diff);
  return 1 / (1 + e);
}


//*** Returns the "desirabilty" of a problem class ***//
//
// Desirable classes are those that have learning scores close to
// .5. Classes with scores close to 1.0 have become too easy to yield
// much benefit; classes with scores close to 0.0 are currently too
// difficult for the user to make progress on.
//
// The desirability function has a triangular shape with
//   desirability(.5) = 1.0
//   desirability(0.0) = 0.0
//   desirability(1.0) = 0.0
//
// Returns: the desirability score in [0.0, 1.0]
LearningModel.prototype.desirability = function(feature) {
  var d = 1.0 - 2.0 * Math.abs(.5 - this.learningScore(feature));
  d = Math.max(d, .05);
  return d;
}


//*** Selects a feature to add to a problem ***//
//
// Selection is based on current learning scores weighted towards
// features that have roughly balanced numbers of correct and 
// incorrect answers
LearningModel.prototype.selectFeature = function() {
    
  // Calculate desirabilities of each feature based on current
  // correct-incorrect answer counts
  var desire = [];
  for (var i = 0; i < this.scores.length; i++) {
    desire.push(this.desirability(this.scores[i]));
  }
    
  // Select a random feature weighted by desirability
  var sum = desire.reduce(function(a, b) {
    return a + b;
  }, 0);
  
  var target = Math.random() * sum;
  
  var cumsum = 0;
  for (var i = 0; i < desire.length; i++) {
    if (target < cumsum + desire[i]) {
      return this.scores[i]
    } else {
      cumsum += desire[i];
    }
  }
}


//*** Check for newly unlocked features ***//
LearningModel.prototype.checkForUnlockedFeatures = function() {
  
  // Basic assignments are the only unlocked feature
  if (!this.ifAllowed) {
    
    // Increase numbers after answering first question
    if (this.learningScore(this.scores[0]) < .50) {
      return;
    }
    
    if (this.maxNumber < 3) {
      this.maxNumber = 3;
    }
    
    if (this.numVariables < 3) {
      this.numVariables++;
    }
    
    // Determine if enough basic assignments have been answered to
    // trigger an increase
    if (this.learningScore(this.scores[0]) < .90) {
      return;
    }
    
    if (this.numVariables < 3) {
      this.numVariables++;
    } else if (this.maxStatements < 3) {
      this.maxStatements++;
    } else {
      this.ifAllowed = true;
      this.numFeatures++;
      
      var obj = {'feature': this.numFeatures, 'correct': 0,
                 'incorrect': 0};
      this.scores.push(obj);
            
      $('#ifModal').modal('show');
    }
  }
    
  // if statements have been unlocked
  if (this.ifAllowed && !this.ifElseAllowed) {
    if (this.learningScore(this.scores[1]) < .90) {
      return;
    }
    
    if (this.maxStatements < 3) {
      this.maxStatements++;
    } else if (this.maxStatementsInConditional < 2) {
      this.maxStatementsInConditional++;
    } else if (this.maxLogicalLevel < 2) {
      this.maxLogicalLevel++;
    } else {
      this.maxLogicalLevel = 1;
      this.ifElseAllowed = true;
      this.numFeatures++;
      
      var obj = {'feature': this.numFeatures, 'correct': 0,
                 'incorrect': 0};
      this.scores.push(obj);
      
      $('#ifElseModal').modal('show');
    }
  }
  
  // if-else statements have been unlocked
  if (this.ifElseAllowed && !this.forAllowed) {
    if (this.learningScore(this.scores[2]) < .90) {
      return;
    }
    
    if (this.maxLogicalLevel < 2) {
      this.maxLogicalLevel++;
    } else {
      this.maxLogicalLevel = 1;
      this.numStatement = 3;
      this.forAllowed = true;
      this.numFeatures++;
      
      var obj = {'feature': this.numFeatures, 'correct': 0,
                 'incorrect': 0};
      this.scores.push(obj);
      
      $('#forModal').modal('show');
    }
  }
  
  // for loops have been unlocked
  if (this.forAllowed && !this.whileAllowed) {
    if (this.learningScore(this.scores[3]) < .90) {
      return;
    }
    
    if (this.maxLogicalLevel < 2) {
      this.maxLogicalLevel++;
    } else {
      this.maxLogicalLevel = 1;
      this.whileAllowed = true;
      this.numFeatures++;
      
      var obj = {'feature': this.numFeatures, 'correct': 0,
                 'incorrect': 0};
      this.scores.push(obj);
      
      $('#whileModal').modal('show');  
    }  
  }
  
  // while loops have been unlocked
  if (this.whileAllowed && !this.functionAllowed) {
    if (this.learningScore(this.scores[4]) < .90) {
      return;
    }
    
    if (this.maxLogicalLevel < 2) {
      this.maxLogicalLevel++;
    }
    else if (this.numStatements < 5) {
      this.numStatements++;
    } else {
      this.functionAllowed = true;
      this.numFeatures++;
      
      var obj = {'feature': this.numFeatures, 'correct': 0,
                 'incorrect': 0};
      this.scores.push(obj);
      
      $('#functionModal').modal('show');
    }  
  }
  
  // Functions have been unlocked
  if (this.functionAllowed) {
    if (this.learningScore(this.scores[5]) < .90) {
      return;
    }
    
    if (this.maxFunctionArgs < 1) {
      this.maxFunctionArgs++;
      
      // Reset the function learning score -- introducing
      // arguments is like a new feature
      if (this.maxFunctionArgs == 1) {
        this.scores[5].correct = 0;
        this.scores[5].incorrect = 0;
        
        $('#functionArgsModal').modal('show');
      }
      
    } else if (this.maxNumFunctions < 1) {
      this.maxNumFunctions++;
    } else if (this.maxFunctionLevel < 1) {
      this.maxFunctionLevel++;
    } else {
      $('#doneModal').modal('show');
    }  
  }
  
  return;
}
