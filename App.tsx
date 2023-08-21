import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

export default function App() {

  const { height } = useWindowDimensions();

  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [postalCode, setPostalCode] = useState('');
  const [cartData, setCartData] = useState<any>([]);

  useEffect(() => {
    const totalPrice = cartData?.reduce((total: any, item: any) => total + item?.price, 0);

    setSubTotal(totalPrice);
    setTax(totalPrice * 0.13);
    setTotal(totalPrice + totalPrice * 0.13 + (cartData?.length == 0 ? 0 : 15));
  }, [cartData]);

  const ListFooterComponent = () => (
    <View
      style={{
        width: '100%',
        borderColor: 'gray',
        marginVertical: '3%',
        borderBottomWidth: 1,
      }}
    />
  );

  const RenderCartCount = (item: any) => {
    return (
      <View
        style={{
          padding: 7,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text>{item?.label}</Text>
        <Text style={{ fontWeight: '600' }}>${item?.amount}</Text>
      </View>
    );
  };

  const removeLineItem = (lineItemId: any) => {
    let temp = cartData?.filter((item: any) => item?.id !== lineItemId);
    setCartData(temp);
  };

  const generateRandomFiveDigitNumber = () => {
    const min = 10000;
    const max = 99999;

    const randomFiveDigitNumber =
      Math.floor(Math.random() * (max - min + 1)) + min;
    return randomFiveDigitNumber;
  };

  const addItemPress = () => {
    const randomFiveDigitNumber = generateRandomFiveDigitNumber();
    let data = {
      quantity: 1,
      price: 499.99,
      swatchTitle: 'Grey',
      swatchColor: '#959392',
      id: randomFiveDigitNumber,
      title: `Grey Sofa ${randomFiveDigitNumber}`,
      image:
        'https://www.cozey.ca/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0277%2F3057%2F5462%2Fproducts%2F2_Single_shot_DARK_GREY_OFF_OFF_SLOPE_17f0f115-11f8-4a78-b412-e9a2fea4748d.png%3Fv%3D1629310667&w=1920&q=75',
    };
    setCartData([...cartData, data]);
  };

  const onChangeText = (text: any) => setPostalCode(text);

  const renderItem = ({ item }: any) => (
    <View style={{ flex: 1, marginVertical: 10 }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Image
          resizeMode="contain"
          source={{ uri: item?.image }}
          style={{ height: 200, width: 200, marginRight: 42 }}
        />
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 15, color: '#172162', fontWeight: '500' }}>
              {`${item?.title} / Without Ottoman / ${item?.quantity}`}
            </Text>
            <View
              style={{
                marginTop: 18,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: 21,
                  height: 21,
                  borderWidth: 1,
                  marginRight: 6,
                  borderRadius: 36,
                  borderColor: '#D3D3D3',
                  backgroundColor: item?.swatchColor,
                }}
              />
              <Text style={{ fontSize: 10, color: '#172162', fontWeight: '500' }}>
                {item?.swatchTitle}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 15, color: '#6e7484', fontWeight: '500' }}>
            {`$ ${item?.price}`}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 50 }}>
            Estimated Delivery Date:
            <Text style={{ color: '#6e7484', fontSize: 12 }}>
              {' Dec 2 - Dec 15'}
            </Text>
          </Text>
          <TouchableOpacity onPress={() => removeLineItem(item?.id)}>
            <Text
              style={{
                fontSize: 12,
                marginTop: 27,
                textDecorationLine: 'underline',
              }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={{ height: 50, marginTop: 30 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Your Cart Is Empty</Text>
    </View>
  );

  useEffect(() => {
    const getData = async () => {
      try {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };
        let newData = await fetch(
          'http://localhost:5001/api/items/getItems',
          requestOptions,
        )
          .then(result => result?.json().then(r => r?.data))
          .catch(error => console.log('fetch error ::', error));
        if (newData?.length != 0) setCartData(newData);
      } catch (error) {
        console.log('try catch error :: ', error);
      }
    };
    getData();
  }, []);

  return (
    <View style={[styles.container, { height }, StyleSheet.absoluteFill]}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, marginTop: 90, paddingHorizontal: 50 }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 30, color: '#172162' }}>Your Cart</Text>
            <TouchableOpacity onPress={addItemPress}>
              <Text
                style={{
                  color: 'blue',
                  fontWeight: '700',
                  textDecorationLine: 'underline',
                }}>
                Add Item
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={cartData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
          />
          {cartData?.length != 0 && (
            <>
              <ListFooterComponent />
              {RenderCartCount({
                label: 'Subtotal',
                amount: subTotal?.toFixed(2),
              })}
              {RenderCartCount({
                label: 'Taxes (estimated)',
                amount: tax?.toFixed(2),
              })}
              {RenderCartCount({
                label: 'Shipping',
                amount: cartData?.length == 0 ? 'Free' : '15',
              })}
              {RenderCartCount({ label: 'Total', amount: total?.toFixed(2) })}
              <View style={{ height: '3%' }} />
              <TextInput
                maxLength={1}
                value={postalCode}
                onChangeText={onChangeText}
                placeholder="Enter Your Postal Code"
                style={{
                  padding: 10,
                  width: '10%',
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: '#000',
                }}
              />
            </>
          )}
          <View style={{ height: '3%' }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
