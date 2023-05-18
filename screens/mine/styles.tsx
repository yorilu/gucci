import { StyleSheet } from 'react-native';
const Styles = StyleSheet.create({
  container: {
    minHeight: '100%'
  },
  topBgWrap:{
    width: '100%'
  },
  topBg:{
    width: '100%',
    height: 200,
    justifyContent: "center"
  },
  headerWrap:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingTop: 44,
    paddingBottom: 18,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: 380
  },
  topLine:{
    color: '#999',
    fontSize: 12,
    width: '100%',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  topLineTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  topLineSubTitle: {
    fontSize: 12,
    color: "#999"
  },
  bodyWrap: {
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FB'
  },
  orderWrap:{
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  orderItem: {
    height: 68,
    width: '49%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  orderItemBg:{
    width: '100%',
    height: '100%'
  },
  orderItemText:{
    position: 'absolute',
    top: 25,
    left: 5,
    fontWeight: 'bold',
    color: '#000'
  },
  orderItemIcon: {},
  bannerCarousel:{
    marginTop: 12,
    height: 150,
    width: 380,
    backgroundColor: "#FFF"
  },
  bannerImage:{
    width: '100%',
    height: '100%'
  },
  operationContainer:{
    marginTop: 12,
    padding: 12,
    borderRadius: 12
  },
  operationWrap:{
    
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  },
  operationItem:{
    width: "25%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  operationImage: {
    width: 50,
    height: 50
  },
  operationTitle: {
    fontSize: 12,
    color: '#333'
  },
  operationSubTitle: {},
  operationWrapTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16
  }
});

export default Styles