import React, { Component } from 'react';
import { Transition } from 'react-transition-group';

export class Fader extends Component {
  render(){

    const { duration, delay } = this.props;

    const defaultStyle = {
      transition: `opacity ${duration}ms ease ${delay || 0}ms`,
      opacity: 0,
    }

    const transitionStyles = {
      entered:  { opacity: 1 },
    };

    return (
      <Template
        {...this.props}
        defaultStyle={defaultStyle}
        transitionStyles={transitionStyles} />
    )
  }
}

export class Zoomer extends Component {
  render(){

    const { duration, delay, style } = this.props;

    const defaultStyle = {
      transition: `transform ${duration}ms ease ${delay || 0}ms`,
      transform: 'scale(0)'
    }

    const transitionStyles = {
      entered:  { transform: 'scale(1)' },
    };

    return (
      <Template
        {...this.props}
        defaultStyle={defaultStyle}
        transitionStyles={transitionStyles} />
    )
  }
}

export class Slider extends Component {
  render(){

    const { duration, delay, direction } = this.props;

    const defaultStyle = {
      transition: `${direction} ${duration}ms ease ${delay || 0}ms`,
      [direction]: '-100vw',
      position: 'relative'
    }

    const transitionStyles = {
      entering: { [direction]: '-100vw' },
      entered:  { [direction]: '0' },
    };

    return (
      <Template
        {...this.props}
        defaultStyle={defaultStyle}
        transitionStyles={transitionStyles} />
    )
  }
}

export class FadeSlider extends Component {
  render(){

    const { duration, delay, direction } = this.props;

    const defaultStyle = {
      transition: `all ${duration}ms ease ${delay || 0}ms`,
      [direction]: '-100vw',
      opacity: 0,
      position: 'relative'
    }

    const transitionStyles = {
      entering: { [direction]: '-100vw', opacity: 0 },
      entered:  { [direction]: '0', opacity: 1 },
    };

    return (
      <Template
        {...this.props}
        defaultStyle={defaultStyle}
        transitionStyles={transitionStyles} />
    )
  }
}

class Template extends Component {
  render(){
    const { determinant, className, defaultStyle, transitionStyles, style } = this.props;

    return (
      <Transition
        in={determinant}
        timeout={{
          appear: 0,
          enter: 0,
          exit: 0
        }}
        {...this.props}>
        {state => (
          <div className={className} style={{...defaultStyle, ...transitionStyles[state], ...style}}>
            {this.props.children}
          </div>
        )}
        </Transition>
    )
  }
}