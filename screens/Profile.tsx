import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import UserCard from '../components/UserCard';
import { connect, ConnectedProps } from 'react-redux';
import { User } from '../interfaces/User';
import { RootState } from '../redux/store';
import PoemCard from '../components/PoemCard';

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

function Profile(props: Props) {
    return (
        <View style={{ flex: 1 }}>
            <UserCard user={props.user} />
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.user.poems.sort((a, b) => b.poemId - a.poemId)}
                renderItem={({ item }) => (
                    <PoemCard item={item} />
                )}
            />

        </View>
    );
}

export default connector(Profile);
