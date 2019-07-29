import React, { Component } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import css from '~/styles/_components.scss';

export class Title extends Component {
  render(){
    const classes = classNames(css.title, this.props.className);
    return (
      <div
        {...this.props}
        className={classes}>
        {this.props.children}
      </div>
    )
  }
}

export class Subtitle extends Component {
  render(){
    const classes = classNames(css.subtitle, this.props.className);
    return (
      <div
        {...this.props}
        className={classes}>
        {this.props.children}
      </div>
    )
  }
}

export class Paragraph extends Component {
  render(){

    let { children } = this.props;
    if (!children) children = '';
    const classes = classNames(css.paragraph, this.props.className);

    return (
      <pre
        {...this.props}
        className={classes}>
        {children.split('\n').map((paragraph, i, arr) => {
          if (paragraph.length > 0) {
            switch (paragraph.charAt(0)){
              case '*': return <div className={css.heading} key={i}>{paragraph.substring(1)}</div>;
              case '>': return <div className={css.subheading} key={i}>{paragraph.substring(1)}</div>;
              case '•': return <li className={css.listitem} key={i}>{paragraph.substring(1).trim()}</li>;
              default: return <p className={css.body} key={i}>{paragraph}</p>;
            }
          } else {
            return null;
          }
        })}
      </pre>
    )
  }
}

export class TruncatedParagraph extends Component {
  render(){
    let { children, paragraphs, link, more } = this.props;
    if (!children) children = '';
    const classes = classNames(css.paragraph, this.props.className);

    const blocks = paragraphs ? (paragraphs * 2) - 2 : 2

    return (
      <pre
        {...this.props}
        className={classes}>
        {children.split('\n').map((ln, i, arr) => {
          const line = <span key={i}>{ln}</span>;

          if (i > blocks) return;
  
          if (i === arr.length - 1) {
            return line;
          } else {
            return [line, <br key={i + 'br'} />];
          }
        })}
        <ReadMore link={link} text={more} />
      </pre>
    )
  }
}

export class Divider extends Component {
  render(){
    return <hr className={css.divider} />
  }
}

export class ReadMore extends Component {
  render(){
    const text = this.props.text || 'Read more...';
    return (
      <Link href={this.props.link}>
        <div className={css.readmore}>
          {text}
        </div>
      </Link>
    )
  }
}