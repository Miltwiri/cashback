import "react-native-gesture-handler"
import { View, Text, StyleSheet, StatusBar, Image, FlatList, TouchableOpacity, Platform, Pressable, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import businessesData from '../../utils/data.json';
import MapView, { Marker } from 'react-native-maps';
import CustomHeader from '@/shared/CustomHeader';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '@/shared/CustomButton';

interface Business {
  id: string;
  name: string;
  street: string;
  status: string;
  category: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  rating?: number;
  offer?: string; // Optional: e.g., "10%"
  offerEnd?: string; // Optional: e.g., "2023-12-31"
  distance?: string; // Optional: e.g., "1.2 km Away"
}


export default function index() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const snapPoints = ['10%', '100%'];
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(0);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(businessesData.map((business) => business.category))];
    setBusinesses(businessesData as Business[]);
    setFilteredBusinesses(businessesData as Business[]);
    setCategories(uniqueCategories);
  }, []);

  const handleSheetChanges = (index: React.SetStateAction<number>) => {
    setBottomSheetIndex(index);
  };

  const filterBusinesses = (category: string | null) => {
    setSelectedCategory(category);
    if (!category || category === 'All') {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((business) => business.category === category);
      setFilteredBusinesses(filtered);
    }
  };

  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness((prev) => (prev?.id === business.id ? null : business));
  
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: business.latitude,
          longitude: business.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        },
        1000 // Animation duration in milliseconds
      );
    }
  };

const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

const onViewableItemsChanged = useRef<({
  viewableItems,
}: {
  viewableItems: { item: Business }[];
}) => void>(({ viewableItems }) => {
  if (viewableItems.length > 0) {
    const business = viewableItems[0].item;
    setSelectedBusiness(business);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: business.latitude,
          longitude: business.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        },
        1000 // Animation duration in milliseconds
      );
    }
  }
}).current;

  const customMapStyle = [
    {
      featureType: "poi", // Hide points of interest (unrelated places)
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit", // Hide transit labels (bus, train, metro, etc.)
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];
  
  const ITEM_WIDTH = 300; // Set this to match the width of each item
  const SPACING = 8; // The right margin spacing

  const flatListRef = useRef<FlatList>(null);

  const scrollToBusiness = (index: number) => {
  flatListRef.current?.scrollToIndex({ 
    index, 
    animated: true,
    viewPosition:0.5
   });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader/>
      {/* <StatusBar backgroundColor="transluscent" barStyle="light-content" /> */}
      <View style={styles.categoryButtonsContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
              onPress={() => filterBusinesses(selectedCategory === item ? null : item)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
      <MapView
  ref={mapRef}
  style={[styles.map, { paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0 }]}
  initialRegion={{
    latitude: businesses[0]?.latitude || -1.286389,
    longitude: businesses[0]?.longitude || 36.817223,
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  }}
  mapType="standard"
  showsUserLocation={true}
  showsCompass={true}
  showsScale={true}
  rotateEnabled={true}
  pitchEnabled={true}
  customMapStyle={customMapStyle} // Add custom styling here
>
          {filteredBusinesses.map((item) => {
            return (
              <Marker
                key={item.id}
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                title={item.name}
                image={require('../../assets/images/map.png')}
                tracksViewChanges={false} // Prevents unnecessary re-renders
                onPress={() => {
                  const index = filteredBusinesses.findIndex(b => b.id === item.id);
                  if (index !== -1) {
                    scrollToBusiness(index);
                    handleSelectBusiness(item);
                  }
                }}
              >
              </Marker>
            );
          }
        )}
      </MapView>
      <View style={styles.placesListContainer}>
      <FlatList
      ref={flatListRef}
      data={filteredBusinesses}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.placesList}
      pagingEnabled
      snapToAlignment="center"
      snapToInterval={ITEM_WIDTH + SPACING}
      decelerationRate="fast"
      getItemLayout={(data, index) => ({
        length: ITEM_WIDTH + SPACING,
        offset: (ITEM_WIDTH + SPACING) * index,
        index,
      })}
      renderItem={({ item, index }) => (
        <View style={styles.placeCard}>
          <Pressable onPress={() => {
            handleSelectBusiness(item);
            scrollToBusiness(index);
          }}>
            <View style={styles.placeCardHeader}>
              <Image 
                source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/earnMap.png')} 
                style={styles.placeImage}   
              />
              <Text style={styles.placeName}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems:"center"}}>
              <Text style={styles.placeStreet}>{item.street}</Text>
              <Text style={styles.placeDistance}>{item.distance}</Text>
              <Text style={{ color: item.status === 'Open' ? '#2AAA8A' : 'red'}}>{item.status}</Text>
            </View>
            {item.offer && (
              <Text style={styles.placeOffer}>
                {item.offer} cash back
              </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <AntDesign
                  key={star}
                  name="star"
                  size={13}
                  color={star <= (item.rating ?? 0) ? "orange" : "gray"}
                  style={{ marginHorizontal: 3 }}
                />
              ))}
            </View>
          </Pressable>
        </View>
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
    </View>
    {/* todo: bottom sheet at times becomes jumpy */}
      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        onChange={handleSheetChanges}
        style={styles.bottomSheet}
        animateOnMount={true}
        enableContentPanningGesture={true}
        overDragResistanceFactor={0.5}
        detached={true}
      >
        <View style={styles.bottomSheetHead}>
          <Text style={styles.bottomSheetHeadNumber}>{filteredBusinesses.length} places nearby</Text>
          <View style={{backgroundColor:"#CCCCFF", padding:10, width:"100%"}}>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <FontAwesome6 name="fire-flame-curved" size={24} color="blue" />
            <Text style={{color: 'white', fontWeight:"500",fontSize:16}}>Earn big for spending at these outlets</Text>
            <FontAwesome6 name="hand-holding-dollar" size={24} color="blue" />
            </View>
          </View>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.businessListContent} showsHorizontalScrollIndicator={false} style={{zIndex:1}}>
          {filteredBusinesses.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View>
              </View>
              <View style={styles.cardContent}>
                <View style={{flexDirection:"row"}}>
                <Image source={{ uri: item.imageUrl }} style={styles.cardIcon}/>
                <Text style={styles.cardTitle}>
                  {item.name}
                </Text>
                </View>
                <View style={{marginTop:10, flexDirection:"row"}}>
                <Text style={styles.placeStreet}>{item.street}</Text>
                <Text style={styles.placeDistance}>{item.distance}</Text>
                <Text style={{ color: item.status === 'Open' ? '#2AAA8A' : 'red'}}>{item.status}</Text>
                </View>
                {item.offer && (
                <Text style={styles.placeOffer}>
                {item.offer} cash back
                </Text>
                )}
                <View style={styles.cardButtons}>
                <CustomButton type="secondary" title="More Info" onPress={() => console.log('More Info Pressed!')} height={50} width={150} borderRadius={30}/>
                <CustomButton type="primary" title="Claim" onPress={() => console.log('Claim Pressed!')} height={50} width={150} borderRadius={30}/>
                </View>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  categoryButtonsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedCategoryButton: {
    backgroundColor: '#1F51FF',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryListContent: {
    paddingHorizontal: 16,
  },
  bottomSheetHead: {
    alignItems: 'center',
    justifyContent:"space-between",
    height:130
  },
  bottomSheetHeadNumber: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom:0
  },
  card: {
    marginBottom: 16,
    borderWidth: 0.4,
    borderColor: 'gray',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginStart:10
  },
  cardIcon: {
    height:22,
    width:22,
    borderRadius:50
  },
  cardCategory: {
    fontSize: 14,
    color: 'gray',
  },
  cardDescription: {
    fontSize: 14,
  },
  cardButtons: {
    flexDirection:"row",
    justifyContent:"space-around",
    marginTop:10
  },
  businessListContent: {
    padding: 16,
  },
  placesListContainer: {
    position: 'absolute',
    bottom: 75,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  placesList: {
    paddingHorizontal: 16,
  },
  placeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 300,
    marginRight: 8,
    borderColor:"gray",
    borderWidth:0.5,
    padding: 10,
  },
  placeCardHeader: {
   flexDirection: 'row',
   alignItems: 'center',
  },
  placeImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  placeName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
    marginRight: 10,
  },
  placeStreet: {
    fontSize: 15,
    color: 'gray',
    fontWeight: '600',
    marginRight: 10
  },
  bottomSheet: {
    zIndex:1
  },
  placeDistance: {
    fontSize: 14,
    color: 'gray',
    fontWeight: '600',
    marginRight: 10,
  },
  placeOffer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00A36C',
    marginTop: 4,
  },  
});