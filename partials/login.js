import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveUser } from '~/reducers/actions';

import { alert, setAlert, displayErrorMessage } from '~/components/alert.js';
import { SubmitButton, CancelButton } from '~/components/button.js';
import { Group, Label, UsernameInput, PasswordInput, Checkbox } from '~/components/form.js';

import { isValidLogin } from '~/constants/validations.js';
import css from '~/styles/auth.scss';

class LoginModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: getCookie('remember')
    }
  }

  /** Handle login fields */
  handleUsername = (event) => { this.setState({username: event.target.value}); }
  handlePassword = (event) => { this.setState({password: event.target.value}); }
  handleRemember = (event) => { this.setState({remember: event.target.checked}); }

  /** Log in as registered user */
  logIn = () => {
    if (!isValidLogin(this.state)) return;

    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => Promise.all([res, res.json()]))
    .then(([status, response]) => { 
      if (status.ok){
        const user = response;
        setCookie('remember', this.state.remember);
        this.props.saveUser(user);
        this.props.close();
        setAlert({ type: 'info', message: `Welcome, ${user.firstname}!` });
        location.reload();
      } else {
        alert.error(response.message)
      }
    })
    .catch(error => {
      displayErrorMessage(error);
    });
  }

  render(){

    const { username, password, remember } = this.state;

    return (
      <Modal
        show={this.props.visible}
        onHide={null}
        centered>
          
        <Modal.Header className={css.modal_header}>
          <h2 className={css.text}>Log In</h2>
        </Modal.Header>

        <Modal.Body className={css.modal_body}>
          <div style={{padding: '0 1em'}}>
            <Group className={css.group}>
              <Label>Username / Email Address:</Label>
              <UsernameInput
                value={username}
                onChange={this.handleUsername}
                placeholder={"Enter username"} />
            </Group>
            <Group className={css.group}>
              <Label>Password:</Label>
              <PasswordInput
                value={password}
                onChange={this.handlePassword}
                placeholder={"Enter password"} />
            </Group>
            <Group style={{marginBottom: 0}}>
              <Checkbox
                checked={remember}
                label={'Remember me'}
                onChange={this.handleRemember} />
            </Group>
          </div>
        </Modal.Body>

        <Modal.Footer className={css.modal_footer}>
          <div>
            <SubmitButton onClick={this.logIn}>Log In</SubmitButton>
            <CancelButton onClick={this.props.close}>Cancel</CancelButton>
          </div>
        </Modal.Footer>
    </Modal>
    )
  }
}

function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
  const expires = `${expires}${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveUser
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);