import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import UserCard from '../components/UserCard';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import PoemCard from '../components/PoemCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../AppNav';

type PoemDetailNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'Profile'
>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: PoemDetailNavigationProp;
};

function Profile(props: Props) {
    return (
        <View style={{ flex: 1 }}>
            <UserCard theUserProp={props.user} navigation={props.navigation} />
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.user.poems.sort((a, b) => b.poemId - a.poemId)}
                renderItem={({ item }) => (
                    <PoemCard item={item} navigation={props.navigation} full={false} />
                )}
            />

        </View>
    );
}

export default connector(Profile);
