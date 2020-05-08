/*Javascript Reinforcement Learning Environment API.*/

const path = require('path')
const all_collections_generated_classes = require(path.resolve(__dirname, './all_collections_generated_classes.jg'))
const {abstractmethod, ABCMeta} = all_collections_generated_classes
const Enum = require('python-enum')

//import abc

class TimeStep extends all_collections_generated_classes.TimeStep {
  /*Returned with every call to `step` and `reset` on an environment.

  A `TimeStep` contains the data emitted by an environment at each step of
  interaction. A `TimeStep` holds a `step_type`, an `observation`, and an
  associated `reward` and `discount`.

  The first `TimeStep` in a sequence will have `StepType.FIRST`. The final
  `TimeStep` will have `StepType.LAST`. All other `TimeStep`s in a sequence will
  have `StepType.MID.

  Attributes:
    step_type: A `StepType` enum value.
    reward: A scalar, or 0 if `step_type` is `StepType.FIRST`, i.e. at the
      start of a sequence.
    discount: A discount value in the range `[0, 1]`, or 0 if `step_type`
      is `StepType.FIRST`, i.e. at the start of a sequence.
    observation: A NumPy array, or a dict, list or tuple of arrays.
  */
  first() {
    return this.step_type === StepType.FIRST
  }

  mid() {
    return this.step_type === StepType.MID
  }

  last() {
    return this.step_type === StepType.LAST
  }
}

class StepType extends Enum.IntEnum {
  /*Defines the status of a `TimeStep` within a sequence.*/
  // Denotes the first `TimeStep` in a sequence.
  FIRST = 0
  // Denotes any `TimeStep` in a sequence that is not FIRST or LAST.
  MID = 1
  // Denotes the last `TimeStep` in a sequence.
  LAST = 2
}

class Base extends object {
  //Abstract base class for javascript RL environments.
    reset() {
    /* 
    Starts a new sequence and returns the first `TimeStep` of this sequence.

    Returns:
      A `TimeStep` namedtuple containing:
        step_type: A `StepType` of `FIRST`.
        reward: Zero.
        discount: Zero.
        observation: A NumPy array, or a dict, list or tuple of arrays
          corresponding to `observation_spec()`.
    */
      throw new Error("Not implemented") 
    }

    step(action) {
    /* 
    Updates the environment according to the action and returns a `TimeStep`.

    If the environment returned a `TimeStep` with `StepType.LAST` at the
    previous step, this call to `step` will start a new sequence and `action`
    will be ignored.

    This method will also start a new sequence if called after the environment
    has been constructed and `restart` has not been called. Again, in this case
    `action` will be ignored.

    Args:
      action: A NumPy array, or a dict, list or tuple of arrays corresponding to
        `action_spec()`.

    Returns:
      A `TimeStep` namedtuple containing:
        step_type: A `StepType` value.
        reward: Reward at this timestep.
        discount: A discount in the range [0, 1].
        observation: A NumPy array, or a dict, list or tuple of arrays
          corresponding to `observation_spec()`.
    */
      throw new Error("Not implemented")
    }

    observation_spec() {
    /*
    Defines the observations provided by the environment.

    Returns:
      A tuple of specs (one per agent), where each spec is a dict of shape
        tuples.
    */
      throw new Error("Not implemented")
    }

    action_spec() {
    /*
    Defines the actions that should be provided to `step`.

    Returns:
      A tuple of specs (one per agent), where each spec is something that
        defines the shape of the actions.
    */
      throw new Error("Not implemented")
    }

    close() {
    /*
    Frees any resources used by the environment.

    Implement this method for an environment backed by an external process.

    This method be used directly
    */
    }

    __enter__() {
      //Allows the environment to be used in a with-statement context.
      return this
    }

    __exit__(unused_exception_type, unused_exc_value, unused_traceback) {
      //Allows the environment to be used in a with-statement context.
      this.close()
    }

    __del__() {
      this.close()
    }
}

module.exports = {
  TimeStep,
  StepType,
  Base,
}
