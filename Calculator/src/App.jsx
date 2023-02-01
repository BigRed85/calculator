import { Component } from 'react'
import './App.css'

/* 
Class: App
I the application container for the calculator
*/
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calulatorType: "Standard",
    }
  }

  render() {

    var calulator;
    switch (this.state.calulatorType) {
      case "Standard":
      default:
        calulator = <StandardCalculator></StandardCalculator>;
    }

    return <div>
      <NavMenu></NavMenu>
      {calulator}
    </div>;
  }
}

/*
Class: Standard Calculator
is a class tha defines a standard calculator that is able to do binary and unirary operations such as:
  -addition
  -subtraction
  -multiplication
  -division
  -square
  -square root
  -fraction
  -precentage

it will have a history and memory capabilities
*/
class StandardCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      operation: "",
      current: "",
      previous: "",
      answer: "",
      equation: "",
      point: false,
      calulatorType: "Standard",
      memory: [],
      history: [],
      count: 0,

    }

    //this is a object that contains refences to all the functions that the buttons will need to initialize
    //this allows for a simplified passing of functions without scoping problems
    this.functions = {
      input: (number) => { this.numberInput(number) },
      add: () => { this.addition() },
      sub: () => { this.subtraction() },
      mult: () => { this.multiplication() },
      div: () => { this.division() },
      percent: () => { this.percent() },
      square: () => { this.square() },
      squareRoot: () => { this.squareRoot() },
      fraction: () => { this.fraction() },
      negation: () => { this.negation() },
      point: () => { this.point() },
      execute: () => { this.execute() },
      back: () => { this.back() },
      clearAll: () => { this.clearAll() },
      clearEntry: () => { this.clearEntry() },
      historyRecall: (index) => { this.historyRecall(index) },
      memoryClear: (index) => { this.memoryClear(index) },
      memoryRecall: (index) => { this.memoryRecall(index) },
      memoryAdd: (index) => {this.memoryAdd(index) },
      memorySubtract: (index) => { this.memorySubtract(index)},
      memorySave: () => { this.memorySave() },
    }

  
  }

  //----------------- calculator button functions --------------

  /*
    function: number input
    purpose: inputs a digit to set as the least signifigant digit
    Perameters:
      <1>: number : the digit to be added to the number
    Output: no output
    Sideffects: changes the value of state.current
  */
  numberInput(number) {//what if the number is the previous answer?
    this.setState({
      current: this.state.current + number,
    });

  }

  /**
   * function: addition
   * Purpose: executes an addition operation
   * perameters: none
   * Output: none
   * Side Effects: answer becomes the sum of the current and pervious values (see execute function for more details)
   */
  addition() {
    this.execute("+");
  }

  /**
   * function: subtraciton
   * purpose: executes a subtraction operation
   * perameters: none
   * output: none
   * side effect: answer becomes the difrence between the prvious and current values (see execute function for more details)
   */
  subtraction() {
    this.execute("-");
  }

  /**
   * function: multiplication
   * purpose: executes a multiplication operation
   * perameters: none
   * output: none
   * side effects: answer becomes the product of the previous and the current values (see the execute function for more details)
   */
  multiplication() {
    this.execute("*");
  }


  /**
   * function: division
   * purpose: executes a division operation
   * perameters: none
   * output: none
   * side effect: answer becomse the product of the previous and the current valuse (see the execute functions for more details)
   */
  division() {
    this.execute("/");
  }

  /**
   * function: execute
   * purpose: execute an operation that is in the state.operation and puts the answer into the state.answer
   * @param {string} newOp : is a new operation that will be put into the state.operation
   * output: none
   * side effect: changes the state of the component
   *  current: ""
   *  previous: the answer
   *  answer: the answer
   *  equation: a string that represents the current equation
   *  history: updated with the current executed eqation
   *  count: count + 1
   * 
   */
  execute(newOp = "") {
    //find the operation to be preformed
    var answer = parseFloat(this.state.answer);
    var current = parseFloat(this.state.current);
    var previous = parseFloat(this.state.previous);
    var operation = this.state.operation;
    var equation = "";

    if (isNaN(answer))
      answer = 0;
    if (isNaN(current))
      current = answer;
    if (isNaN(previous))
      previous = 0;

    switch (operation) {
      case "+":
        answer = previous + current;
        break;
      case "-":
        answer = previous - current;
        break;
      case "*":
        answer = previous * current;
        break;
      case "/":
        answer = previous / current;
        break;
      default:
        answer = current;
        break;
    }

    var history;
    if (newOp === "") {
      equation = this.updateEquation(true);
      //update hist
      history = this.updateHistory(equation, answer);
    }
    else {
      if (this.state.previous !== "" && this.state.operation !== "") { //if there is already an equation that has been executed record it in history befor preping the next
        equation = this.updateEquation(true);
        history = this.updateHistory(equation, answer);
      }
      
      equation = answer + newOp; //this is the equation based on the newOp
      history = this.state.history;
    }
   

    this.setState({
      current: "",
      operation: newOp,
      previous: answer,
      answer: answer,
      equation: equation,
      history: history,
      count: this.state.count+1,
    })

  }

  /**
   * function: percent
   * purpose: cange the current value to a precentage of the previous value (eg. pervious: 4, current 50, results in current becoming 2 )
   * parameters: none
   * output: none
   * side effects: none
   */
  percent() {
    var answer = parseFloat(this.state.answer);
    var current = parseFloat(this.state.current);

    if (isNaN(answer))
      answer = 0;
    if (isNaN(current))
      current = 0;

    var current = this.state.answer * this.state.current / 100;

    this.setState({
      current: current,
    })
  }

  /**
   * function: fraction
   * purpose: changes the current value into the inverse 1/current in decimal 
   * peramaters: none
   * output: none
   * side effects: none
   * 
   */
  fraction() { //look into fixing this so that it returns an error if current is 0
    var current = this.getCurrentValue();

    if (current == 0)
      return;

    current = 1 / current;
    current = String(current);

    this.setState({
      current: current,
    });

  }

  /**
   * function: square
   * purpose: squares the current value 
   * paramaters: none
   * output: none
   * side effects: none
   */
  square() {
    var current = this.getCurrentValue();

    if (current == 0)
      return;

    current *= current;
    current = String(current);

    this.setState({
      current: current,
    });
  }

  /**
   * function: square root
   * purpose: the current value becomes the square root
   * parameters: none
   * returns: none
   * side effect: none
   */
  squareRoot() {
    var current = this.getCurrentValue();

    if (current == 0)
      return;

    current = Math.sqrt(current);
    current = String(current);

    this.setState({
      current: current,
    });
  }

  /**
   * function: negation
   * purpose: multiplies the current value by negative 1
   * paramaters: none
   * returns: none
   * side effect none
   */
  negation() {
    var current = this.getCurrentValue();

    current = -current;

    this.setState({
      current: String(current),
    })


  }

  /**
   * function: point 
   * purpose: adds a decimal point to the current value (if there is not one)
   * parameters: none
   * return: none
   * side effects: none
   */
  point() {
    var current = this.getCurrentValue();

    current = String(current);
    current = current + '.';

    this.setState({
      current: current,
    })
  }


  /**
   * function: back
   * purpose: remove the last character added to the current value
   * parameters: none
   * retruns: none
   * side effect: none
   */
  back() {
    //go back one step (in the creation of the current)(backspace)
    var current = this.state.current;
    var length = current.length;

    current = current.substring(0, length - 1);

    this.setState({
      current: current,
    });
  }

  /**
   * function: clear all
   * purpose: clears the current equation and sets all relative state values to ""
   * paramaters: none
   * returns: none
   * side effects: none
   */
  clearAll() {
    //clear all
    this.setState({
      current: "",
      previous: "",
      answer: "",
      operation: "",
      equation: "",
    });
  }

  /**
   * function: clear entry
   * purpose: clears the current value
   * paramaters: none
   * returns: none
   * side effects: clears the answer value
   */
  clearEntry() {
    //clear current
    this.setState({
      current: "",
      answer: "",
    });

  }

  //------------------ helper functions

  /**
   * function: update equation
   * purpose: generates an updated equation based on the values in the state
   * @param {boolean} isCompleat : signifies if the equation is a compleat equation
   * @returns a string that is the new equation
   * side effects: none
   */
  updateEquation(isCompleat = false) {
    //the posible equations are
    // previous + operation + current : a compleat equation has been entered
    // previous + operation : where the second half of the equation has not been entered yet
    // current : a compleat equation with only one entry "a = a"
    var equation = "";
    var current = this.state.current;
    var previous = parseFloat(this.state.previous);
    var operation = this.state.operation;
    var answer =  parseFloat(this.state.answer);

    if (isNaN(previous))
      previous = 0;
    if (isNaN(answer))
      answer = 0;

    if (isCompleat || this.state.operation === "") {
      current = parseFloat(current);
      current = isNaN(current) ? answer : current;
    }


    if (this.state.operation === "") {
      equation = current;
    }
    else {
      equation = previous + " " + operation + " " + current;
    }

    return equation;
  }

  
  /**
   * function: get current value
   * purpose: a helper functio that returns the current value 
   * paramaters: none
   * @returns the current value
   * side effects: none
   */
  getCurrentValue() {
    var current = parseFloat(this.state.current);
    var answer = parseFloat(this.state.answer);
    
    answer = isNaN(answer) ? 0 : answer;
    current = isNaN(current) ? answer : current;

    return current;
  }


  //------------------ history functions -------------------------------

  /**
   * function: update History
   * purpose: generates a new history entry that can be added to the history state
   * @param {*} equation : the equation that will be added to the new history entry
   * @param {*} answer : the answer to be added to he new history entry
   * @returns the generated history entry
   * side effects: none
   */
  updateHistory(equation, answer) {
    var history = this.state.history;
    var newHist = {
      equation: equation,
      answer: answer,
      key: this.state.count,
    }

    history.push(newHist);

    if (history.length > 30) {
      history.reverse();
      history.pop();
      history.reverse();
    }


    return history;
  }

  /**
   * Function: history recall
   * purpose: recall the given history entry and set the equation and answer values acordingly   * 
   * @param {*} index : the index of the history value to be recalled
   * returns: none
   * side effects: the current, previous, and operation valuse are cleared
   */
  historyRecall(index) {
    const history = this.state.history[index];

    this.setState({
      equation: history.equation,
      answer: history.answer,
      current: "",
      previous: "",
      operation: "",
    });
  }

  //----------- memory functions --------------------------------------

  /**
   * function: memory clear
   * purpose: deletes the memory entry at the given index, if no index is given deletes all the memory entries
   * @param {*} index : the index of the memory entry to be deleted
   * returns: none
   * side effects: none
   */
  memoryClear(index = null) {
    //if index is null clear the memeory 
    if (index === null) {
      this.setState({
        memory: [],
      });
    }
    else {
      //otherwise delete the entry at index
      const memory = this.state.memory;
      memory.splice(index, 1);

      this.setState({
        memory: memory,
      });
    }

    
  }

  /**
   * function: memory recall
   * purpose: recalls the memory value at given index, seting the current value to hte memory value
   * @param {*} index : the index of the memory value to recall
   */
  memoryRecall(index) {
    //recalls the current memory 
    this.setState({
      current: this.state.memory[index],
    })
  }

  /**
   * function: memory add
   * purpose: adds the current value to the memory value at the given index
   * @param {*} index : the index of the memory value that will be added to
   * return: none
   * side effects: none
   */
  memoryAdd(index) {
    //adds the current value to the memory value at the given index
    var value = this.getCurrentValue();

    this.memoryAdd2(value, index);
  }

  /**
   * function: memory subtract 
   * purpose: subtracts the current value to the memory value at the given index
   * @param {*} index : the index of the memory value to will be subtracted from
   * return: none
   * side effects: none
   */
  memorySubtract(index) {
    //subtracts the current value from the memory value at the given index
    var value = this.getCurrentValue();
    value *= -1;

    this.memoryAdd2(value, index);
  }

  //this is a helper function that will add the value to memory at the given index
  //it is unsafe as it dose not check if the value is a number
  //use memoryAdd or memorySubtract

  /**
   * function: memory add 2
   * purpose: this is a helper function that will add the values to memory at the given index 
   * @param {*} value : the value to be added
   * @param {*} index : the index of the memory to be added to
   * return: none
   * side effects: none
   * 
   * note: this is unsafe as it does not check if the value is a number, use memoryAdd or memorySubtract
   */
  memoryAdd2(value, index) {
    const memory = this.state.memory;

    if (memory.length <= 0) {
      memory.push(value);
    }
    else {
      memory[index] += value;
    }

    this.setState({
      memory: memory,
    });
  }

  /**
   * function: memory save
   * purpose: saves the current value into a new memory cell
   * paramaters: none
   * return: none
   * side effects: none
   */
  memorySave() {
    //saves a new memory entry
    const memory = this.state.memory;
    var value = this.getCurrentValue();

    memory.push(value);

    this.setState({
      memory: memory,
    });
  }


  //--------- the render function -----------------------------------
  render() {

    return (
      <div className="calculator standard_calculator">
        <CalculatorOutput type={this.state.calulatorType}
          current={this.state.current}
          answer={this.state.answer}
          operation={this.state.operation}
          equation={this.state.equation}></CalculatorOutput>
        <MemoryButtons memory={this.state.memory} functions={this.functions}></MemoryButtons>
        <CalculatorButtons type={this.state.calulatorType} functions={this.functions}></CalculatorButtons>
        <CalculatorAside history={this.state.history} memory={this.state.memory} functions={this.functions}></CalculatorAside>
      </div>
    )
  }
};

/**
 * class: calculator output
 * the component that acts as the main output of the caluculator 
 * this consists of the equation and the current value (which will sometimes be the answer)
 */
class CalculatorOutput extends Component {
  constructor(props) {
    super(props);
  }



  render() {
    var current = this.props.current;
    var answer = this.props.answer;
    var equation = this.props.equation;

    if (answer === "")
      answer = "0";

    if (current === "")
      current = answer;


    return (
      <div className='calculator_output'>
        <div className='equation_out'>{equation}</div>
        <div className='current_out'>{current}</div>
      </div>
    )
  }
};

/**
 * class: calculator buttons
 * this component contains the buttons of the calculator that will input digits and execute functions
 * props:
 *  type: the type of caluculator that this belongs to
 *  function: a object that contains all the function needed by the buttons
 */
class CalculatorButtons extends Component {
  constructor(props) {
    super(props);
  }


  render() {

    return (
      <div className='calculator_buttons'>
        <CalculatorButton className="function_button" function={this.props.functions.percent} text="%"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.clearEntry} text="CE"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.clearAll} text="C"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.back} text="Back"></CalculatorButton>

        <CalculatorButton className="function_button" function={this.props.functions.fraction} text="1/<var>x</var>"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.square} text="<var>x</var><sup>2</sup>"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.squareRoot} text="&radic;"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.div} text="/"></CalculatorButton>

        <CalculatorButton className="number_button" function={this.props.functions.input} text="7"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="8"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="9"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.mult} text="&times;"></CalculatorButton>

        <CalculatorButton className="number_button" function={this.props.functions.input} text="4"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="5"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="6"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.sub} text="-"></CalculatorButton>

        <CalculatorButton className="number_button" function={this.props.functions.input} text="1"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="2"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="3"></CalculatorButton>
        <CalculatorButton className="function_button" function={this.props.functions.add} text="+"></CalculatorButton>

        <CalculatorButton className="number_button" function={this.props.functions.negation} text="+/-"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.input} text="0"></CalculatorButton>
        <CalculatorButton className="number_button" function={this.props.functions.point} text="."></CalculatorButton>
        <CalculatorButton className="execute_button" function={this.props.functions.execute} text="="></CalculatorButton>
      </div>
    )
  }
};

/**
 * class: calculator button
 * this component acts as a calculator button that will call a function and display a given text
 * props:
 *  function: the function that the button will execute
 *  className: the name of the class the button will belong to
 *  text: the text to be displayed (or used in the function call for number input)
 */
class CalculatorButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <button onClick={() => this.props.function(this.props.text)} className={this.props.className} dangerouslySetInnerHTML={{ __html: this.props.text }}></button>
  }

};

class MemoryButtons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const index = this.props.memory.length - 1;

    if (index < 0) {
      //if the memory array is empty
      return (
        <div>
          <button className='memory_button disabled'>MC</button>
          <button className='memory_button disabled'>MR</button>
          <button className='memory_button' onClick={() => this.props.functions.memoryAdd(index)}>M+</button>
          <button className='memory_button' onClick={() => this.props.functions.memorySubtract(index)}>M-</button>
          <button className='memory_button' onClick={() => this.props.functions.memorySave()}>MS</button>
        </div>
      );
    }

    return(
      <div>
        <button className='memory_button' onClick={() => this.props.functions.memoryClear()}>MC</button>
        <button className='memory_button' onClick={() => this.props.functions.memoryRecall(index)}>MR</button>
        <button className='memory_button' onClick={() => this.props.functions.memoryAdd(index)}>M+</button>
        <button className='memory_button' onClick={() => this.props.functions.memorySubtract(index)}>M-</button>
        <button className='memory_button' onClick={() => this.props.functions.memorySave()}>MS</button>
      </div>
    );
  }

};

/**
 * class: calculator aside
 * a side section that will contain the history and the memory for the calculator
 * props:
 *  memory: the memory array 
 *  history:  the history array
 *  functions:  an object that contains all the needed function regarding memory and history
 */
class CalculatorAside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: "History",
    }
  }

  switch(switchTo) {
    this.setState({
      selection: switchTo,
    });
  }

  render() {
    var toDisplay;
    var history_select = "history_select"
    var memory_select = "memory_select"
    switch (this.state.selection) {
      case "Memory":
        toDisplay = <CalculatorMemory memory={this.props.memory} functions={this.props.functions}></CalculatorMemory>
        memory_select = memory_select + " aside_selected";
        break;
      case "History":
      default:
        toDisplay = <CalculatorHistory history={this.props.history} functions={this.props.functions}></CalculatorHistory>
        history_select = history_select + " aside_selected";
    }

    return (
      <div className='aside'>
        <button onClick={() => this.switch("History")} className={history_select}>History</button>
        <button onClick={() => this.switch("Memory")} className={memory_select}>Memory</button>
        {toDisplay}
      </div>
    );
  }
};

/**
 * class: Calculator History
 * the component that is used to display the history
 * props: 
 *  history: the history array that will be displayed
 *  functions: an object containing refences to the needed funcitons for history recall
 */
class CalculatorHistory extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const history = this.props.history;

    if (history.length <= 0) {
      return <div>There's no history yet</div>
    }

    const listHistory = history.map((history, index) => {
      //show the equation and the awnser are a button
      return (
        <li key={history.key} className="aside_list_item">
          <div onClick={() => {this.props.functions.historyRecall(index)}} className='aside_list_item_button'>
            <div>{history.equation} =</div>
            <div>{history.answer}</div>
          </div>
        </li>
      );
    });

    listHistory.reverse();
  
    return <ul className='aside_list'>{listHistory}</ul>;
  }
};

/**
 * class: Calculator Memory 
 * the component the displayes the memory arrya 
 * props
 *  memory: the memory array that will be displayed 
 *  functions: an object containing the refences to function that are needed for memory recall and modification
 */
class CalculatorMemory extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const memory = this.props.memory;

    if (memory.length <= 0) {
      return (
        <div>There's nothing saved in memory</div>
      );
    }

    const memoryList = memory.map((memory, index) => {
      return(
        <li key={index} className='aside_list_item'>
          <div onClick={() => {this.props.functions.memoryRecall(index)}} className='aside_list_item_button'>
            <div>{memory}</div>
            <div className='memory_sub_buttons'>
              <button onClick={ (e) => {e.stopPropagation(); this.props.functions.memoryClear(index);}}>MC</button>
              <button onClick={ (e) => {e.stopPropagation(); this.props.functions.memoryAdd(index);}}>M+</button>
              <button onClick={ (e) => {e.stopPropagation(); this.props.functions.memorySubtract(index);}}>M-</button>
            </div>
          </div>
        </li>
      );
    });

    memoryList.reverse();

    return <ul className='aside_list'>{memoryList}</ul>;
  }
};

//this will alow the user to select other types of calculators
class NavMenu extends Component {
  render() {
    return <nav></nav>
  }
};

class NavMenuButton extends Component {
  render() {
    return <div></div>
  }
};

export default App
