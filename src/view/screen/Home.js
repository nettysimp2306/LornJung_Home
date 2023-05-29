import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import Weather from "../../../components/Weather";
import { API_KEY } from "../../../utils/WeatherAPIKey";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "./color";
//import { Notifications } from 'react-native-notifications';

class Home extends Component {
  state = {
    isLoading: false,
    temperature: 0,
    weatherCondition: null,
    error: null,
  };

  componentDidMount() {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === "granted") {
          Location.getCurrentPositionAsync()
            .then((position) => {
              this.fetchWeather(
                position.coords.latitude,
                position.coords.longitude
              );
            })
            .catch((error) => {
              console.error("Error Getting Weather Conditions:", error);
              this.setState({
                isLoading: false,
                error: "Error Getting Weather Conditions",
              });
            });
        } else {
          this.setState({
            isLoading: false,
            error: "Location permission not granted",
          });
        }
      })
      .catch((error) => {
        console.error("Error Getting Location Permission:", error);
        this.setState({
          isLoading: false,
          error: "Error Getting Location Permission",
        });
      });
  }

  fetchWeather = (lat = 25, lon = 25) => {
    this.setState({ isLoading: true });

    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        const cel = json.main.temp;
        const hu = json.main.humidity;

        const fahrenheit = cel * (9/5) + 32;
        const humidity = hu / 100;
        const heatindex = -42.379 + (2.04901523 * fahrenheit) + (10.14333127 * humidity) - (0.22475541 * (fahrenheit * humidity)) - (0.00683783 * (fahrenheit ** 2)) - (0.05481717 * (humidity ** 2)) + (0.00122874 * ((fahrenheit ** 2) * humidity)) + (0.00085282 * (fahrenheit * (humidity ** 2))) - (0.00000199 * (fahrenheit ** 2) * (humidity ** 2));

        this.setState({
          isLoading: false,
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          heatindex,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false, error: "Error Fetching Weather" });
      });
  };

  render() {
    const { isLoading, temperature, error , heatindex} = this.state;

    let titleText;
    let subtitleText; 
    var n = 0;
  
  //ทำเกี่ยวกับ Notification แจ้งเตือน Heat Index
    switch (true) {
      case heatindex >= 125:
        titleText = 'ระดับความร้อนอันตรายมาก';
        subtitleText = 'o ระดับความร้อนนี้อันตรายมาก อย่าออกนอกบ้านเด็ดขาด \no หาที่ร่มรื่นและเย็นสบาย เพื่อป้องกันจากความร้อนฉุกเฉินที่อาจก่อให้เกิดอันตรายต่อร่างกาย \noดื่มน้ำเย็นอย่างต่อเนื่องเพื่อรักษาความชื้นในร่างกาย ระวังอาการเหนื่อยหอบหรือมีอาการผิดปกติอื่นๆ \noหากมีอาการผิดปกติหรือรู้สึกไม่สบาย ติดต่อสถานพยาบาลหรือเจ้าหน้าที่ทางการแพทย์ทันที';
        if(n == 0){
          const scheduleNotification = () => {
            Notifications.postLocalNotification({
              title: 'เตือนภัย',
              body: 'สภาวะอากาศร้อนอันตรายมากเหล่านี้เป็นอันตรายสำหรับชีวิต คุณควรหลีกเลี่ยงการอยู่ภายนอกในเวลาเหล่านี้',
              extra: {
                key1: 'value1',
                key2: 'value2',
              },
            });
          };
          n++;
        }

        break;
        
      case heatindex >= 103 && heatindex < 124:
        n = 4;
        titleText = 'ระดับความร้อนอันตราย';
        subtitleText = 'o หลีกเลี่ยงการอยู่นอกอาคารหรือที่แสงแดดตรงโดยเฉพาะในช่วงเวลาที่อากาศร้อนมากที่สุด\no ให้ใช้เสื้อผ้าที่ระบายความร้อนและหมวกหรือผ้าคลุมหัวเพื่อป้องกันจากแสงแดด\no ดื่มน้ำเพียงพอและบ่อยครั้งเพื่อรักษาความชื้นในร่างกาย หากมีอาการไม่สบายหรืออาการอ่อนเพลียรุนแรง\no ให้หาที่ร่มรื่นและพักผ่อนให้เพียงพอ';
        if(n == 0){
          const scheduleNotification = () => {
            Notifications.postLocalNotification({
              title: 'เตือนภัย',
              body: 'อย่าออกนอกบ้านหากไม่จำเป็น ให้หาที่ร่มรื่นหรือใช้ร่มบังเพื่อป้องกันจากแสงแดดที่ร้อนจัดดื่มน้ำเย็นและดื่มน้ำมากๆ \nและใส่หมวกหรือผ้าคลุมหัวเพื่อปกป้องจากแสงแดดและรังแดดโดยตลอด',
              extra: {
                key1: 'value1',
                key2: 'value2',
              },
            });
          };
          n++;
        }
        break;

      case heatindex >= 90 && heatindex < 103:
        n = 3;
        titleText = 'ระดับความร้อนสูง';
        subtitleText = 'อย่าลืมดื่มน้ำเพียงพอและเพิ่มปริมาณการดื่มในสภาวะอากาศร้อนระดับสูง\no สวมใส่เสื้อผ้าบางเบาและระบายอากาศได้ดีเพื่อช่วยลดความร้อนและรักษาความรู้สึกสดชื่น\no หลีกเลี่ยงกิจกรรมที่ต้องการพลังงานมากหรือเครื่องใช้ที่อาจเพิ่มความร้อนให้แก่ร่างกายในช่วงเวลาที่อากาศร้อนสูงสุด.';
        if(n == 0){
          const scheduleNotification = () => {
            Notifications.postLocalNotification({
              title: 'เตือนภัย',
              body: 'ระวังความร้อนสูง! ดื่มน้ำเพียงพอและรักษาร่างกายเย็นสบายตลอดเวลา',
              extra: {
                key1: 'value1',
                key2: 'value2',
              },
            });
          };
          n++;
        }
        break;

      case heatindex >= 80 && heatindex < 90:
        n = 2;
        titleText = 'ระดับความร้อนปาน';
        subtitleText = 'อย่าลืมดื่มน้ำเพียงพอและบ่อยครั้งเพื่อรักษาความชุ่มชื้นในร่างกาย\no สวมใส่เสื้อผ้าบางเบาและระบายอากาศได้ดีเพื่อช่วยลดความร้อนและรักษาความรู้สึกสดชื่น\n oหลีกเลี่ยงการอยู่ภายนอกในช่วงเวลาที่ร้อนที่สุดและหากจำเป็นต้องอยู่ภายนอก\no ให้สวมหมวกหรือใช้ร่มกันแดดเพื่อป้องกันจากแสงแดดโดยตรง.';
        if(n == 0){
          const scheduleNotification = () => {
            Notifications.postLocalNotification({
              title: 'เตือนภัย',
              body: 'เตรียมน้ำให้เพียงพอและสวมใส่เสื้อผ้าบางเบาเพื่อรักษาความสดชื่นในสภาพอากาศร้อนระดับปานกลาง',
              extra: {
                key1: 'value1',
                key2: 'value2',
              },
            });
          };
          n++;
        }
        break;

      case heatindex >= 0 && heatindex < 79:
        titleText = 'ไม่มีอันตราย';
        subtitleText = 'Low Heat Stay Safe :)';
        break;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={styles.header}>
          <View style={{}}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.subtitle}>Heat Index</Text>
          </View>
          <View style={styles.IconEdit}>
            <Icon
              name="send"
              size={30}
              color={COLORS.white}
              onPress={() => this.props.navigation.navigate("Detail")}
            />
          </View>
        </View>

        <View style={styles.topContainer}>
          <View style={styles.top}>
            <Image
              source={require("../../assets/temp.png")}
              style={{ width: 100, height: 100, position: "relative" }}
            />
            <View style={styles.topLayout}>
              {isLoading ? (
                <Text style={styles.loadingText}>Fetching The Weather</Text>
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <Weather temperature={temperature} />
              )}
              <Text style={{ color: "white" }}>Temp(°C)</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.cardTop1}>
            <View style={styles.barTop1}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: 40,
                    height: 30,
                    alignItems: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Shirt
                </Text>
              </View>
              <View>
                <Image
                  source={require("../../assets/tshirt.png")}
                  style={{ width: 40, height: 40, position: "relative" }}
                />
              </View>
            </View>
            <View style={styles.contentZone}>
              <View style={styles.colorContainer}>
                <View style={styles.color1}></View>
                <View style={styles.color2}></View>
                <View style={styles.color3}></View>
              </View>
            </View>
          </View>
          <View style={styles.cardTop2}>
            <View style={styles.barTop2}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Status
                </Text>
              </View>
              <View>
                <Image
                  source={require("../../assets/risk.png")}
                  style={{ width: 40, height: 40, position: "relative" }}
                />
              </View>
            </View>
            <View style={styles.contentZone2}>
              <View style={styles.colorContainer2}>
                <View style={styles.risk1}></View>
                <View style={styles.risk2}></View>
                <View style={styles.risk3}></View>
                <View style={styles.risk4}></View>
              </View>
              <View style={styles.ArrowUp}>
                <Image
                  source={require("../../assets/arrow-up.png")}
                  style={{ width: 20, height: 20, position: "relative" }}
                />
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Level : 1
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomcard}>
          <View style={styles.bottomcard1}>
            <View style={styles.bottomBar1}>
              <View style={styles.statusBarBottom1}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: 50,
                      height: 30,
                      alignItems: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Water
                  </Text>
                </View>
                <View style={styles.Iamge1}>
                  <Image
                    source={require("../../assets/water-bottle.png")}
                    style={{ width: 40, height: 40, position: "relative" }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.bottomBarContent}>
              <View style={styles.Bottle}>
                <View style={styles.Water}></View>
              </View>

              <View style={styles.BottleFa}></View>
            </View>
            <View style={styles.btnGroup}>
              <View style={styles.btnReset}>
                <Icon name="cached" size={30} color={COLORS.white}></Icon>
              </View>
              <View style={styles.Lit}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>0.1L</Text>
              </View>
              <View style={styles.btnAdd}>
                <Icon name="add" size={29} color={COLORS.white}>
                  {" "}
                </Icon>
              </View>
            </View>
          </View>

          <View style={styles.bottomcard2}>
            <View style={styles.bottomBar1}>
              <View style={styles.statusBarBottom1}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: 100,
                      height: 30,
                      alignItems: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    อาการ
                  </Text>
                </View>
                <View style={styles.Iamge1}>
                  <Image
                    source={require("../../assets/emergency-call.png")}
                    style={{ width: 40, height: 40, position: "relative" }}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.textAgency}>
              {titleText}
            </Text>
            <Text style={styles.textAgency}>
              • ไม่มีเหงื่อออก รู้สึกกระหายน้ำมาก
            </Text>
            <Text style={styles.textAgency}>• หายใจถี่ ชีพจรเต้นแรง</Text>
            <Text style={styles.textAgency}>
              • ปวดศีรษะ หน้ามืด ความดันโลหิตต่ำ อ่อนเพลีย คลื่นไส ้อาเจียน
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 5,
            marginLeft: 190,
            padding: 24,
            backgroundColor: "#ff6600",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            size: 20,
          }}
        >
          <Text>โทรฉุกเฉิน</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.green,
  },

  loadingText: {
    fontSize: 16,
    color: "rgba(236, 153, 95, 1)",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  IconEdit: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
    borderRadius: 25,
  },
  top: {
    flexDirection: "row",
    backgroundColor: COLORS.gray,
    borderRadius: 15,
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    marginTop: 20,
  },
  topContainer: {
    marginTop: 20,
  },
  cardTop1: {
    height: 165,
    width: 165,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 10,
  },
  cardTop2: {
    height: 165,
    width: 165,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderTopRightRadius: 10,
    borderColor: COLORS.gray,
    borderRadius: 10,
  },
  statusContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  barTop1: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  barTop2: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  color1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.light,
    borderWidth: 1,
  },
  color2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.yellow,
    borderWidth: 1,
  },
  color3: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.orange,
    borderWidth: 1,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  risk1: {
    width: 30,
    height: 20,
    borderRadius: 5,
    backgroundColor: COLORS.green2,
    borderWidth: 1,
  },
  risk2: {
    width: 30, 
    height: 20,
    borderRadius: 5,
    backgroundColor: COLORS.yellow2,
    borderWidth: 1,
  },
  risk3: {
    width: 30,
    height: 20,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
    borderWidth: 1,
  },
  risk4: {
    width: 30,
    height: 20,
    borderRadius: 5,
    backgroundColor: COLORS.red,
    borderWidth: 1,
  },
  colorContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
  },
  ArrowUp: {
    marginLeft: 25,
  },
  bottomcard1: {
    height: 225,
    width: 165,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginTop: 25,
  },
  statusBarBottom1: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  Bottle: {
    width: 120,
    height: 50,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderRadius: 20,
  },
  BottleFa: {
    width: 20,
    height: 30,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderRadius: 10,
  },
  bottomBarContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  Water: {
    backgroundColor: COLORS.sky,
    width: 100,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderRadius: 20,
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 25,
  },
  btnReset: {
    padding: 10,
    backgroundColor: COLORS.btnWater,
    borderRadius: 15,
  },
  btnAdd: {
    padding: 10,
    backgroundColor: COLORS.btnWater,
    borderRadius: 15,
  },
  bottomcard2: {
    height: 240,
    width: 165,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginTop: 25,
  },
  bottomcard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textAgency: {
    alignItems: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Home;
