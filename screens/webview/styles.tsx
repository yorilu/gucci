import { StyleSheet } from 'react-native';
const Styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8"
  },
  containerWrap:{
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#FFF"
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  searchText: {
    color: "#666"
  },
  searchWrap: {
    backgroundColor: "#f5f5f5",
    color: "#999",
    borderRadius: 50,
    padding: 10,
    display: "flexbox",
    flexDirection: "row"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  bannerCarousel:{
    height: 150,
    width: '100%',
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: "#FFF"
  },
  bannerImage:{
    width: '100%',
    height: 150
  },
  secondBannerCarousel:{
    height: 100,
    width: '100%',
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: "#FFF"
  },
  secondBannerImage:{
    width: '100%',
    height: 110
  },
  operationImage:{
    width: 50,
    height: 50
  },
  slide1:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE'
  },
  operationCarousel:{
    marginTop: 20,
    width : '100%',
    height: 200
  },
  operationWrap:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  operationItem:{
    width: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  blockTitle:{
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#f8f8f8"
  },
  blockTitleText:{
    fontSize: 20,
    paddingLeft: 12,
    paddingRight: 12,
    color: '#000',
    fontWeight: "bold"
  },
  hotGoods:{
    paddingLeft: 12,
    paddingRight: 12,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8"
  },
  hotItem:{
    width: "49%",
    display: "flex",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
    marginBottom: 10
  },
  hotItemImg:{
    height: 173,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  hotItemName:{
    paddingTop: 10,
    paddingBottom: 10
  },
  hotItemWrap:{
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 15
  },
  hotItemUnit:{
    fontSize: 12,
    color: '#ff4351'
  },
  hotItemMoney: {
    fontSize: 20,
    color: '#ff4351',
    fontWeight: "bold",
    marginRight: 5
  },
  hotItemMarketMoney:{
    textDecorationLine: "line-through",
    fontSize: 12,
    color: "#999"
  },
  hotItemMoneyWrap:{
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start"
  }
});

export default Styles