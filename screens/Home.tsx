import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Poem } from '../interfaces/Poem';
import PoemCard from '../components/PoemCard';
import { connect, ConnectedProps } from 'react-redux';
import { FAB, IconButton } from 'react-native-paper';
import { User } from '../interfaces/User';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { HomeStackParamList } from '../AppNav';

type HomeScreenNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<{Home: undefined}, 'Home'>,
    StackNavigationProp<HomeStackParamList>
>



const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: HomeScreenNavigationProp;
};

function Home(props: Props) {
    props.navigation.setOptions({
        headerLeft: () => {
            return (
                <IconButton icon="menu"
                    onPress={() => {
                        props.navigation.openDrawer();
                    }} />
            );
        },
    });
    
    return (
        <View>
            <FlatList
                keyExtractor={(_i, index) => index.toString()}
                data={props.poems.sort((a, b) => b.poemId - a.poemId)}
                renderItem={({ item }) => {
                    return <PoemCard item={item} />;
                }}
            />
            <FAB onPress={() => props.navigation.push('WritePoem')} style={styles.fab} icon="plus" />
        </View>
    );
}

export default connector(Home);

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 12,
        right: 0,
        bottom: 0,
    },
});
