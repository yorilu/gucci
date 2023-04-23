import { StyleSheet } from 'react-native';
const Styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8"
  },
  redGif: {
    width: 300,
    height: 350,
    position: 'relative'
  },
  redGifClose: {
    position: "relative",
    left: 140,
    top: 10,
    color: '#FFF',
    padding: 10
  },
  tags:{
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: "row",
    marginTop: 17,
    marginBottom: 9
  },
  tagWrap:{
    backgroundColor: 'rgba(0,0,0,0)',
    marginRight: 24
  },
  tagText: {
    color: '#333',
    fontSize: 14
  },
  tagTextSelected: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  redModal:{
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "80%",
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 200,
    left: 0,
    top: 0,
  },
  containerWrap:{
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#F8F9FB"
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  searchText: {
    color: "#666",
    flex: 1
  },
  searchBtn:{
    backgroundColor: '#FF4351',
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 50,
  },
  searchBtnText: {
    color: "#FFF",
  },
  searchWrap: {
    backgroundColor: "#FFF",
    color: "#999",
    borderRadius: 50,
    position: 'relative',
    top: -35,
    marginBottom: -20,
    padding: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
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
    backgroundColor: "#FFF"
  },
  bannerImage:{
    width: '100%',
    height: '100%'
  },
  secondBannerCarousel:{
    width: '100%',
    height: 110,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: "#FFF"
  },
  secondBannerImage:{
    width: '100%',
    height: 110,
    borderRadius: 10
  },
  operationImage:{
    width: 50,
    height: 50
  },
  operationTitle: {
    fontSize: 12,
    color: '#333'
  },
  operationSubTitle: {
    fontSize: 10,
    color: '#999'
  },
  slide1:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE'
  },
  operationCarousel:{
    width : '100%',
    borderRadius: 10
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