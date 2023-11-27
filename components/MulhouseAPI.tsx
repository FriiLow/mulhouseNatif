import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, Image, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import axios, { AxiosResponse } from 'axios';
import {Session} from "@supabase/supabase-js";
import {supabase} from "../lib/supabase";

interface EventItem {
    uid: string;
    title_fr: string;
    description_fr: string;
    daterange_fr: string;
    image: string;
    canonicalurl: string;
}

const MulhouseAPI: React.FC = ({ session }: { session: Session }) => {
    const [data, setData] = useState<EventItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<any> = await axios.get(
                    "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=location_name%3D%22Mulhouse%22%20and%20firstdate_begin%20%3C%20date'2024'&order_by=firstdate_begin%20DESC&limit=20"
                );
                setData(response.data.results);
                console.log(session);
            } catch (error) {
                console.error('Erreur lors de la requête API', error);
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }: { item: EventItem }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title_fr}</Text>
                <Text style={styles.description}>{item.description_fr}</Text>
                <Text style={styles.daterange}>{item.daterange_fr}</Text>
                <Text style={styles.link} onPress={() => Linking.openURL(item.canonicalurl)}>
                    Voir plus
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(item)}>
                    <Text style={styles.buttonText}>Ajouter à ma liste</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleButtonPress = async (item: EventItem) => {
        // Logique à exécuter lorsque le bouton est pressé
        console.log(`Bouton pressé pour l'événement : ${item.title_fr}`);
        const {error} = await supabase
            .from('events')
            .insert({user_id: session.user.id, event_uid: item.uid});
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Les événements de Mulhouse!</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.uid}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    container: {
      flex: 1,
      padding: 16,
      marginTop: 50,
    },

    header: {
      alignItems: 'center',
      marginBottom: 20,
    },

    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        marginBottom: 4,
    },
    daterange: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default MulhouseAPI;
