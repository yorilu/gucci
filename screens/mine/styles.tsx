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
    marginRight: 24,
    position: 'relative'
  },
  tagText: {
    color: '#333',
    fontSize: 14
  },
  tagTextSelected: {
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 10
  },
  tagSelectedImg:{
    width: '100%',
    position: 'absolute',
    bottom: -10,
    zIndex: 1
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
    marginTop: 0,
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
  operationCarousel:{
    width : '100%',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 16
  },
  operationWrap:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start"
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
    overflow: "hidden",
    backgroundColor: "#FFF",
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 12
  },
  hotItemImg:{
    width: 64,
    height: 64,
    marginBottom: 12
  },
  hotItemName:{
    marginBottom: 10,
    fontWeight: 'bold'
  },
  hotItemBtn:{
    width: 90,
    height: 26,
    borderRadius: 30,
    backgroundColor: '#FF4351',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center'
  },
  hotItemText:{
    color: '#FFF',
    fontSize: 12
  }
});

export default Styles