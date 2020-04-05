import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Poem } from '../interfaces/Poem';
import PoemCard from '../components/Card';
import { connect, ConnectedProps } from 'react-redux'
import { User } from '../interfaces/User';
import { RootState } from '../redux/store';

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems
})

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}

function Home(props: Props) {
    return (
        <View>
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.poems}
                renderItem={({ item }) => {
                    return (
                        <PoemCard
                            item={item}
                        />
                    );
                }}
            />
        </View>
    );
}

export default connector(Home);