import { StyleSheet } from 'react-native';
const Styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    height: "100%",
    width: "100%"
  },
  modal:{
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 200,
    left: 0,
    top: 0,
  },
  img: {
    width: 300,
    height: 350,
    position: 'relative'
  },
  close: {
    position: "relative",
    left: 140,
    top: 0,
    color: '#FFF',
    padding: 10
  },
});

export default Styles