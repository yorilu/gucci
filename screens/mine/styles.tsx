import { StyleSheet } from 'react-native';
const Styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    paddingBottom: 30,
    backgroundColor: '#F8F9FB'
  },
  scrollView: {
    height: '100%'
  },
  topBgWrap:{
    backgroundColor: '#FFF',
    position: 'relative'
  },
  topIconsWrap:{
    position: 'absolute',
    right: 0,
    top: 12,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  topIcon:{
    width: 32,
    height: 32,
    marginRight: 15
  },
  kefuIcon:{
    marginRight: 12
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
    right: 0,
    paddingTop: 44,
    paddingBottom: 18,
    paddingHorizontal: 24,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topLine:{
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
    display: "flex",
  },
  topLineTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  avatar:{
    width: 64,
    height: 64,
    position: 'absolute',
    left: 24,
    top: -32,
    borderRadius: 32
  },
  topLineSubTitle: {
    fontSize: 12,
    color: "#999",
  },
  bodyWrap: {
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FB'
  },
  orderWrap:{
    marginTop: 12,
    marginBottom: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  orderItem: {
    height: 68,
    width: '49%',
    backgroundColor: '#FFF'
  },
  orderItemBg:{
    width: '100%',
    height: '100%'
  },
  orderItemText:{
    position: 'absolute',
    top: 25,
    left: 10,
    fontWeight: 'bold',
    color: '#000'
  },
  orderItemIcon: {},
  bannerCarousel:{
    height: 150,
    backgroundColor: "#FFF"
  },
  bannerImage:{
    width: '100%',
    height: '100%'
  },
  operationContainer:{
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF'
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
    width: 32,
    height: 32
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
  },
  quitWrap:{
    paddingVertical: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFF",
    color: '#333',
    borderRadius: 12,
    marginTop: 12
  }
});

export default Styles