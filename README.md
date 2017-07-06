# COLT: the Coding Literacy Trainer
COLT is an adaptive system for training new programmers in coding literacy.

Coding literacy is the ability to understand a written computer program in order to interpret its functionality and output. In the same way that reading is preparatory to writing, literacy is a valuable skill for novice programmers, because understanding written code requires developing and applying mental models of how programs execute.

Enrollments in CS classes are still growing, and more students are coming into the field from non-traditional backgrounds, possibly lacking some of the preprequisites (particularly in algebra) that have traditionally been assumed in the CS major. We think tools like COLT provide one means of bridging that gap and getting more students to success in their first programming class.

COLT generates a random program, presents it to a user, and asks a question about the program's output. As the user responds, the system maintains a learning model that keeps track of the user’s correct and incorrect answers. As the user demonstrates progress, the system unlocks new features and gradually makes the problem more complex.

Our learning model is based on a framework called Adaptive Intrinsic Curiosity. Inspired by [Lisa Meeden’s work](http://www.cs.swarthmore.edu/~meeden) in developmental robotics, AIC attempts to identify the right level of difficulty for a learner, avoiding both “plateaus,” where problems are too easy to be interesting, and “mountains,” where they’re too difficult.

## Implementation
COLT is a front-end web application. Its code, including the learning model and random program generation algorithms, are written in JavaScript. It uses the Bootstrap framework for layout and styling.

## Authors
COLT was created by Neeraj Chatlani and [Dan Myers](http://dansmyers.github.io) at [Rollins College](http://www.rollins.edu).

## Support

We gratefully acknowledge the support of the [Mindlin Foundation](https://mindlinfoundation.org).
