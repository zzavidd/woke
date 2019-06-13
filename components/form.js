import React, { Component} from 'react';
import { Form, Row } from 'react-bootstrap';
import Textarea from 'react-textarea-autosize';
import classNames from 'classnames';
import css from '~/styles/_components.scss';

/** For the form heading */
export class Heading extends Component {
  render(){
    return (
      <div className={css.heading}>{this.props.children}</div>
    )
  }
}

/** For grouping form components */
export class Group extends Component {
  render(){
    const classes = classNames(css.group, this.props.className);
    return (
      <Form.Group
        as={Row}
        className={classes}
        style={this.props.style}>
        {this.props.children}
      </Form.Group>
    )
  }
}

/** For labels */
export class Label extends Component {
  render(){
    return (
      <Form.Label className={css.label}>{this.props.children}</Form.Label>
    )
  }
}

/** For inline text inputs */
export class Input extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: props.value
    }
  }
  render(){
    return (
      <input
        type={'text'}
        name={this.props.name}
        placeholder={this.props.placeholder}
        className={css.input}
        autoComplete={'off'}
        value={this.props.value || ''}
        onChange={this.props.onChange} />
    )
  }
}

/** For long text inputs */
export class TextArea extends Component {
  constructor(props){
    super(props);
    this.state = {
      wordCount: props.value ? props.value.length : 0
    }
  }

  handleTextChange = (event) => {
    this.props.onChange(event);
    this.setState({wordCount: event.target.value.length})
  }

  render(){
    return (
      <div>
        <Textarea
          name={this.props.name}
          placeholder={this.props.placeholder}
          className={css.textarea}
          minRows={3}
          value={this.props.value || ''}
          onChange={this.handleTextChange} />
        <label className={css.wordcount}>{this.state.wordCount}</label>
      </div>
    )
  }
}

/** For dropdown menus */
export class Select extends Component {
  render(){
    const { placeholder, items } = this.props;
    return (
      <select
        className={css.select}
        {...this.props}>
        <option value={''} disabled>{placeholder}</option>
        {React.Children.map(items, (item) => {
          return <option value={item}>{item}</option>
        })}
      </select>
    )
  }
}

export class Checkbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      checked: props.checked
    }
  }
  render(){
    return (
      <label className={css.checkbox}>
        <input
          type={'checkbox'}
          checked={this.state.checked}
          onChange={this.props.onChange}
          className={css.box} />
          {this.props.label}
      </label>
    )
  }
}

/** File selector */
export class FileSelector extends Component {
  render(){
    return (
      <div className={css.file}>
        <label className={css.file_button}>
          Browse...
          <input
            type={'file'}
            style={{display: 'none'}}
            onChange={this.props.onChange} />
        </label>
        <input
          type={'text'}
          disabled
          value={this.props.value}
          placeholder={'Choose a file'}
          className={css.file_input} />
      </div>
    )
  }
}