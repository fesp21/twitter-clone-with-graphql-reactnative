import React, { Component } from 'react';
import styled from 'styled-components/native';
import Touchable from '@appandflow/touchable';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import Loading from './Loading';
import { logout } from '../actions/user';

const AVATAR_SIZE = 30;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

const Avatar = styled.Image`
  height: ${AVATAR_SIZE};
  width: ${AVATAR_SIZE};
  borderRadius: ${AVATAR_RADIUS};
`;

const ButtonLeft = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, bottom: 20, right: 20, left: 20 },
})`
  marginLeft: 15;
  justifyContent: center;
  alignItems: center;
`;

class HeaderAvatar extends Component {
  _onOpenActionSheet = () => {
    const options = ['Logout', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.props.client.resetStore();
          return this.props.logout();
        }
      },
    );
  };
  render() {
    if (!this.props.info) {
      return (
        <ButtonLeft disabled>
          <Loading size="small" />
        </ButtonLeft>
      );
    }
    return (
      <ButtonLeft onPress={this._onOpenActionSheet}>
        <Avatar source={{ uri: this.props.info.avatar }} />
      </ButtonLeft>
    );
  }
}

export default withApollo(
  connect(state => ({ info: state.user.info }), { logout })(
    connectActionSheet(HeaderAvatar),
  ),
);
