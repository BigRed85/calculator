import { Component, useState } from 'react'
import reactLogo from './assets/react.svg'
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
    switch(this.state.calulatorType) {
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
      answer: "",
      point: false,
      calulatorType: "Standard",
      memory: [],
      history: [],

    }

    this.functions = {
      input: (number) =>  {this.numberInput(number)},
      add: () => {this.addition()},
      sub: () => {this.subtraction()},
      mult: () => {this.multiplication()},
      div: () => {this.division()},
      percent: () => {this.percent()},
      square: () => {this.square()},
      squareRoot: () => {this.squareRoot()},
      fraction: () => {this.fraction()},
      negation: () => {this.negation()},
      point: () => {this.point()}, 
      execute: () => {this.execute()},
      back: () => {this.back()},
      clearAll: () => {this.clearAll()},
      clearEntry: () => {this.clearEntry()},
    }
  }

  numberInput(number) {//what if the number is the previous answer?
    this.setState({
      current: this.state.current + number,
    });

  }

  addition() {
    if (this.state.current != "")
      this.execute();

    this.setState({
      operation: "+",
    });
  }

  subtraction() {
    this.execute();

    this.setState({
      operation: "-",
    });
  }

  multiplication() {
    this.execute();

    this.setState({
      operation: "*",
    });
  }

  division() {
    this.execute();

    this.setState({
      operation: "/",
    });
  }

  execute() {
    //find the operation to be preformed
    var answer = parseFloat(this.state.answer);
    var current = parseFloat(this.state.current);

    if (isNaN(answer))
      answer = 0;
    if (isNaN(current))
      current = 0;


    switch(this.state.operation) {
      case "+":
        answer = answer + current;
        break;
      case "-":
        answer = answer - current;
        break;
      case "*":
        answer = answer * current;
        break;
      case "/":
        answer = answer / current;
        break;
      default:
        answer = current;
        break;
    }

    this.setState({
      current: "",
      operation: "",
      answer: answer,
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
      answer: "",
      operation: "",
    });
  }

  clearEntry() {
    //clear current
    this.setState({
      current: "",
    });

  }


  render() {
  
    return (
      <div className="calculator standard_calculator">
        <CalculatorOutput type={this.state.calulatorType} 
                          current={this.state.current} 
                          answer={this.state.answer}
                          operation={this.state.operation}></CalculatorOutput>
        <CalculatorButtons type={this.state.calulatorType} functions={this.functions}></CalculatorButtons>
        <CalculatorAside history={this.state.history} memory={this.state.memory}></CalculatorAside>
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
    var operation = this.props.operation;

    if (operation != "" && answer === "") {
      answer = "0";
    }

    var equation = answer + " " + operation;

    if (current === "")
      current = "0";
      

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

    return <div className='calculator_buttons'>
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
  }
};

class CalculatorButton extends Component {
    constructor(props) {
      super(props);

      
    }

    render() {
      return <button onClick={() => this.props.function(this.props.text)} className={this.props.className} dangerouslySetInnerHTML={{__html: this.props.text}}></button>
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

  switch(event) {
    var toSwitchTo = event.target.innerText;

    this.setState({
      selection: toSwitchTo,
    });
  }

  render() {
    var toDisplay
    switch (this.state.selection) {
      case "Memory":
        toDisplay = <CalculatorMemory></CalculatorMemory>
        break;
      case "History":
      default:
        toDisplay = <CalculatorHistory></CalculatorHistory>
    }

    return <div className='aside'>
                <button onClick={this.switch}>History</button>
                <button onClick={this.switch}>Memory</button>
                {toDisplay}
          </div>
  }
};

class CalculatorHistory extends Component {
  render() {
    return <div></div>
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
