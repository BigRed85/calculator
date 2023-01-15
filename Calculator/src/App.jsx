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
    }

  
  }

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
    var current = parseFloat(this.state.current);

    if (isNaN(current))
      current = 0;

    if (current == 0)
      return;

    current = 1 / current;
    current = String(current);

    this.setState({
      current: current,
    });

  }

  square() {
    var current = parseFloat(this.state.current);

    if (isNaN(current))
      current = 0;

    if (current == 0)
      return;

    current *= current;
    current = String(current);

    this.setState({
      current: current,
    });
  }

  squareRoot() {
    var current = parseFloat(this.state.current);

    if (isNaN(current))
      current = 0;

    if (current == 0)
      return;

    current = Math.sqrt(current);
    current = String(current);

    this.setState({
      current: current,
    });
  }

  negation() {
    var current = parseFloat(this.state.current);

    if (isNaN(current))
      current = 0;

    current = -current;

    this.setState({
      current: String(current),
    })


  }

  point() {
    var current = parseFloat(this.state.current);

    if (isNaN(current))
      current = 0;

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


  render() {

    return (
      <div className="calculator standard_calculator">
        <CalculatorOutput type={this.state.calulatorType}
          current={this.state.current}
          answer={this.state.answer}
          operation={this.state.operation}
          equation={this.state.equation}></CalculatorOutput>
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

};

class MemoryButton extends Component {

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

    const listHistory = history.map((history, index) => {
      //show the equation and the awnser are a button
      return (
        <li key={history.key} className="history_item">
          <button onClick={() => {this.props.functions.historyRecall(index)}}>
            <div>{history.equation} =</div>
            <div>{history.answer}</div>
          </button>
        </li>
      );
    })

    listHistory.reverse();

    return <ul className='history_list'>{listHistory}</ul>
  }
};

class CalculatorMemory extends Component {
  render() {
    return <div></div>
  }
};

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
