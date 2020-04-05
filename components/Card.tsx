import React, { useEffect, useState } from 'react';
import { Card, Paragraph, Text, IconButton } from 'react-native-paper';
import { Poem } from '../interfaces/Poem';
import { connect, ConnectedProps } from 'react-redux'
import { User } from '../interfaces/User';
import { updatePoem } from '../redux/actions/Poem';

interface RootState {
    user: User
}

const mapState = (state: RootState) => ({
    user: state.user
})

const mapDispatch = {
    updatePoem
};

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    item: Poem
}

function PoemCard(props: Props) {
    let [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        for (let i in props.item.likes) {
            if (props.item.likes[i].username === props.user.username) {
                setLiked(true);
                return;
            }
        }
    })

    return (
        <Card style={{ marginHorizontal: 8, marginVertical: 4 }}>
            <Card.Title titleStyle={{ textAlign: 'center', fontSize: 22 }} title={props.item.title} subtitle={props.item.author.username} />
            <Card.Content>
                <Paragraph>{props.item.body}</Paragraph>
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
                {
                    liked ?
                        <IconButton color="red" icon="heart" style={{ marginRight: 0 }}
                            onPress={() => {
                                setLiked(false);
                                let poem = props.item;
                                let myindex = poem.likes.findIndex((val) => val.username === props.user.username)
                                poem.likes.splice(myindex);
                                props.updatePoem(poem);
                            }}
                        />
                        :
                        <IconButton icon="heart-outline" style={{ marginRight: 0 }}
                            onPress={() => {
                                setLiked(true);
                                let poem = props.item;
                                poem.likes.push(props.user);
                                props.updatePoem(poem);
                            }}
                        />
                }
                <Text>{props.item.likes.length}</Text>
            </Card.Actions>
        </Card>
    )
}

export default connector(PoemCard)
