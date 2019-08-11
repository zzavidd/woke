import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Col } from 'react-bootstrap';

import { alert } from '~/components/alert.js';
import { SubmitButton, CancelButton } from '~/components/button.js';
import { Group, Label, Select } from '~/components/form.js';
import { Shader, Default, Mobile } from '~/components/layout.js';
import { Loader, Empty } from '~/components/loader.js';
import { Modal, ConfirmModal } from '~/components/modal.js';
import { Icon } from '~/components/icon.js';
import { Fader } from '~/components/transitioner.js';
import { Title } from '~/components/text.js';

import CLEARANCES from '~/constants/clearances.js';
import { formatDate } from '~/constants/date.js';
import request from '~/constants/request.js';

import css from '~/styles/users.scss';


class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [],
      isLoaded: false
    };

    if (props.user.clearance < CLEARANCES.ACTIONS.VIEW_USERS){
      return location.href = '/';
    }
  }

  /** Get topics on mount */
  componentDidMount() {
    this.getRegisteredUsers();
  }

  /** Retrieve all registered users */
  getRegisteredUsers = () => {
    request({
      url: '/getRegisteredUsers',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`,
        'Clearance': CLEARANCES.ACTIONS.VIEW_USERS,
        'Content-Type': 'application/json',
      },
      onSuccess: (result) => {
        this.setState({
          users: result,
          isLoaded: true
        });
      }
    });
  }

	render(){

    const { isLoaded, users } = this.state;

    if (!isLoaded){
      return <Loader/>;
    } else if (users.length === 0) {
      return <Empty message={'No users found.'} />;
    }

    const items = [];

    for (const [index, item] of users.entries()) {
      items.push(<User key={index} idx={index} item={item} getRegisteredUsers={this.getRegisteredUsers} />);
    }

    const UserTable = () => {
      const headerRow = (
        <div className={css.header}>
          <span>No.</span>
          <span>Name</span>
          <span>Clearance</span>
          <span>Email Address</span>
          <span>Username</span>
          <span>Last Login</span>
          <span>Date Registered</span>
          <span></span>
          <span></span>
        </div>
      )

      return (
        <div className={css.grid}>
          {headerRow}
          {items}
        </div>
      );
    };

    const UserList = () => {
      return <div className={css.list}>{items}</div>;
    };

    const UserCollection = () => {
      return (
        <React.Fragment>
          <Default><UserTable/></Default>
          <Mobile><UserList/></Mobile>
        </React.Fragment>
      )
    }

    return (
      <Shader className={css.container}>
        <Title className={css.heading}>List of Registered Users</Title>
        <UserCollection/>
      </Shader>
    );
	}
}

class _User extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      ...props.item,
      editVisible: false,
      deleteVisible: false,
      isLoaded: false
    }
  }

  componentDidMount(){
    this.setState({ isLoaded: true });
  }

  handleSelect = (event) => {
    const { name, value } = event.target;
    this.setState({[name]: value}); }

  openEdit = () => this.setState({ editVisible: true});
  closeEdit = () => this.setState({ editVisible: false});
  openDelete = () => this.setState({ deleteVisible: true});
  closeDelete = () => this.setState({ deleteVisible: false});

  /** Change user's clearance */
  changeClearance = () => {
    const { id, firstname, lastname, clearance} = this.state;
    request({
      url: '/changeClearance',
      method: 'PUT',
      body: JSON.stringify({id, clearance}),
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`,
        'Clearance': CLEARANCES.ACTIONS.CRUD_USERS,
        'Content-Type': 'application/json',
      },
      onSuccess: () => {
        alert.success(`You've successfully changed ${firstname} ${lastname}'s clearance.`);
        this.closeEdit();
        this.props.getRegisteredUsers();
      }
    });
  }

  /** Delete User */
  deleteUser = () => {
    const { id, firstname, lastname } = this.state;
    request({
      url: '/deleteAccount',
      method: 'DELETE',
      body: JSON.stringify({id}),
      headers: {
        'Authorization': process.env.AUTH_KEY,
        'Content-Type': 'application/json',
      },
      onSuccess: () => {
        alert.success(`You've deleted user: ${firstname} ${lastname}.`);
        this.closeDelete();
        this.props.getRegisteredUsers();
      }
    });
  }

  render(){
    const { item, idx } = this.props;
    const { clearance, editVisible, deleteVisible } = this.state;

    const header = (
      <h2 className={css.text}>Change Clearance</h2>
    );
    const body = (
      <Group style={{margin: '1em 0 1.5em'}}>
        <Col>
          <Label>Clearance:</Label>
          <Select
            name={'clearance'}
            value={clearance}
            items={CLEARANCES.LEVELS.USERS}
            onChange={this.handleSelect}
            placeholder={'Select clearance level...'} />
        </Col>
      </Group>
    );
    const footer = (
      <React.Fragment>
        <SubmitButton onClick={this.changeClearance}>Confirm</SubmitButton>
        <CancelButton onClick={this.closeEdit}>Cancel</CancelButton>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <Fader
          key={idx}
          determinant={this.state.isLoaded}
          duration={500 + (idx * 100)}
          className={css.row}
          postTransitions={'background-color .1s ease'}>
          <Default>
            <span>{idx+1}</span>
            <span>{item.firstname} {item.lastname}</span>
            <span>{item.clearance}</span>
            <span>{item.email}</span>
            <span>{item.username}</span>
            <span>{formatDate(item.last_login)}</span>
            <span>{formatDate(item.create_time)}</span>
            <span><button className={css.invisible_button} onClick={this.openEdit}><Icon name={'edit'} /></button></span>
            <span><button className={css.invisible_button} onClick={this.openDelete}><Icon name={'trash'} /></button></span>
          </Default>
          <Mobile>
            <Title className={css.name}>{item.firstname} {item.lastname}</Title>
            <div>{item.clearance}</div>
            <div>{item.email}</div>
            <div>{item.username}</div>
            <div>{formatDate(item.create_time)}</div>
            <div className={css.index}>{idx+1}</div>
          </Mobile>
        </Fader>

        <Modal
          show={editVisible}
          header={header}
          body={body}
          footer={footer} />

        <ConfirmModal
          visible={deleteVisible}
          message={'Are you sure you want to delete this user?'}
          confirmFunc={this.deleteUser}
          confirmText={'Delete'}
          close={this.closeDelete} />
      </React.Fragment>
    ); 
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const User = connect(mapStateToProps)(_User);
export default connect(mapStateToProps)(Users);