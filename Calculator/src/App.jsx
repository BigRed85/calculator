import { Component, useState } from 'react'
import './App.css'

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
  numberInput(number) {//what if the number is the previous answer?
    this.setState({
      current: this.state.current + number,
    });

  }

  addition() {
    this.execute("+");
  }

  subtraction() {
    this.execute("-");
  }

  multiplication() {
    this.execute("*");
  }

  division() {
    this.execute("/");
  }

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

  percent() {
    //cange the cuurent to a precent of the answer
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

  negation() {
    var current = this.getCurrentValue();

    current = -current;

    this.setState({
      current: String(current),
    })


  }

  point() {
    var current = this.getCurrentValue();

    current = String(current);
    current = current + '.';

    this.setState({
      current: current,
    })
  }

  back() {
    //go back one step (in the creation of the current)(backspace)
    var current = this.state.current;
    var length = current.length;

    current = current.substring(0, length - 1);

    this.setState({
      current: current,
    });
  }

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

  clearEntry() {
    //clear current
    this.setState({
      current: "",
      answer: "",
    });

  }

  //------------------ helper functions

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

  //this function will return the current value (i should look through the code to find were this could be of use!)
  getCurrentValue() {
    var current = parseFloat(this.state.current);
    var answer = parseFloat(this.state.answer);
    
    answer = isNaN(answer) ? 0 : answer;
    current = isNaN(current) ? answer : current;

    return current;
  }


  //------------------ history functions -------------------------------
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

  memoryRecall(index) {
    //recalls the current memory 
    this.setState({
      current: this.state.memory[index],
    })
  }

  memoryAdd(index) {
    //adds the current value to the memory value at the given index
    var value = this.getCurrentValue();

    this.memoryAdd2(value, index);
  }

  memorySubtract(index) {
    //subtracts the current value from the memory value at the given index
    var value = this.getCurrentValue();
    value *= -1;

    this.memoryAdd2(value, index);
  }

  //this is a helper function that will add the value to memory at the given index
  //it is unsafe as it dose not check if the value is a number
  //use memoryAdd or memorySubtract
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
