import React, { Component } from 'react';
import styled from 'styled-components/native';
import { graphql, compose, withApollo } from 'react-apollo';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import FeedCard from '../components/FeedCard/FeedCard';
import Loading from '../components/Loading';
import { getUserInfo } from '../actions/user';
import GET_TWEETS_QUERY from '../graphql/queries/getTweets';
import ME_QUERY from '../graphql/queries/me';

const Root = styled.View`
  flex: 1;
  paddingTop: 5;
`;

class HomeScreen extends Component {
  componentDidMount() {
    this._getInfo();
  }

  _getInfo = async () => {
    const { data: { me } } = await this.props.client.query({ query: ME_QUERY })
    this.props.getUserInfo(me);
  }

  _renderItem = ({ item }) => <FeedCard {...item} />

  render() {
    const { tweets } = this.props;

    if (tweets.loading) {
      return <Loading />;
    }
    return (
      <Root>
        <FlatList
          contentContainerStyle={{ alignSelf: 'stretch' }}
          data={tweets.getTweets}
          keyExtractor={item => item._id}
          renderItem={this._renderItem}
        />
      </Root>
    );
  }
}

export default withApollo(compose(
  connect(undefined, { getUserInfo }),
  graphql(GET_TWEETS_QUERY, { name: 'tweets' }),
)(HomeScreen));
