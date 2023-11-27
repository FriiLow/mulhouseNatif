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

const HomeScreen: React.FC = ({  route }: { route: { params: { session: Session | null } } }) => {
    const [data, setData] = useState<EventItem[]>([]);
    const { session } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<any> = await axios.get(
                    'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=location_name%3D%22Mulhouse%22%20and%20firstdate_begin%20%3C%20date%272024%27&order_by=firstdate_begin%20DESC&limit=1'
                );
                setData(response.data.results);
                console.log('Session :', session);
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
            <Text style={styles.headerText}>Bienvenue à Mulhouse, {session?.user.username} !</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>User Name</Text>
              <Text style={styles.infoText}>{session?.user.username}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Email</Text>
              <Text style={styles.infoText}>{session?.user.email}</Text>
            </View>
          </View>

          <View style={styles.subheader}>
            <Text style={styles.headerText}>Événement à la une</Text>
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
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 120,
        alignSelf: 'center',
        borderRadius: 8,
        marginBottom: 20
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

    container: {
      flex: 1,
      padding: 16,
      marginTop: 50,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    subheader: {
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 40,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    infoBox: {
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
      flex: 1,
      margin: 8,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 16,
    },
});

export default HomeScreen;
