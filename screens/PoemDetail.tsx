import React, { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { addPoem, setPoem } from '../redux/actions/Poem';
import { addUserPoem } from '../redux/actions/User';
import { HomeStackParamList } from '../AppNav';
import PoemCard from '../components/PoemCard';
import firestore from '@react-native-firebase/firestore';
import { poemsCollectionId } from '../constants/collection';
import { Poem } from '../interfaces/Poem';
import Toast from 'react-native-simple-toast';

type PoemDetailNavigationProp = StackNavigationProp<HomeStackParamList, 'PoemDetail'>;

type PoemDetailRouteProp = RouteProp<HomeStackParamList, 'PoemDetail'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    addPoem,
    setPoem,
    addUserPoem,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: PoemDetailNavigationProp;
    route: PoemDetailRouteProp;
};

function PoemDetail(props: Props) {

    const [mypoem, setMyPoem] = useState<Poem>(props.route.params!.poem);
    const [refresh, setRefresh] = useState(false)

    let fetchThePoem = async () => {
        try {
            let res = await firestore().collection(poemsCollectionId).where('date', "==", props.route.params!.poem.date).where('username', "==", props.route.params!.poem.username).get()
            let data = [...props.poems];
            let index = data.findIndex((i) => (i.username === props.route.params!.poem.username && i.date === props.route.params!.poem.date));
            data[index] = res.docs[0].data() as Poem;
            setMyPoem(res.docs[0].data() as Poem);
            props.setPoem(data);
        } catch (e) {
            setRefresh(false);
            Toast.show('Please check your internet connection!');
            console.log(e);
        }
    }


    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={async () => {
                        setRefresh(true);
                        await fetchThePoem();
                        setRefresh(false);
                    }}
                />
            }
            
        >
            <PoemCard item={mypoem} navigation={props.navigation} full={true} />
        </ScrollView>
    );
}

export default connector(PoemDetail);

const styles = StyleSheet.create({});
