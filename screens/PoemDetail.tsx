import React from 'react'
import { StyleSheet, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { addPoem } from '../redux/actions/Poem';
import { addUserPoem } from '../redux/actions/User';
import { HomeStackParamList } from '../AppNav';
import PoemCard from '../components/PoemCard';

type PoemDetailNavigationProp = StackNavigationProp<
    HomeStackParamList,
    'PoemDetail'
>;

type PoemDetailRouteProp = RouteProp<HomeStackParamList, 'PoemDetail'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    addPoem,
    addUserPoem
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: PoemDetailNavigationProp;
    route: PoemDetailRouteProp;
};

function PoemDetail(props: Props){
    return (
        <View>
            <PoemCard
                item={props.route.params!.poem}
                navigation={props.navigation}
                full={true}
            />
        </View>
    )
}

export default PoemDetail

const styles = StyleSheet.create({})
