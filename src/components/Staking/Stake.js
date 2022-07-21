import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getStatusInfos, getTokenInfos, harvestFunc, unstakeFunc, waterLandFunc, getRewardEstimate } from "../../functions/Utility";
import { setTimer } from '../../store/actions';
import ProgresModal from "../Modals/ProgresModal";

const Title = styled("h1")({
  fontFamily: `Maven Pro, sans-serif`,
  fontStyle: `normal`,
  fontWeight: `700`,
  fontSize: `28px`,
  lineHeight: `30px`,
  textAlign: "center",
  textTransform: "uppercase",
  color: `#FFFFFF`,
  '@media (max-width: 450px)': {
    fontSize: "20px"
  }
});
const LuckyImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "fill",
});
const StatTitle = styled("h1")({
  fontFamily: `Maven Pro, sans-serif`,
  fontStyle: `normal`,
  fontWeight: `700`,
  fontSize: `28px`,
  lineHeight: `30px`,
  textAlign: "center",
  textTransform: "uppercase",
  color: `#c1d117`,
  paddingBottom: "20px",
});

const DigitContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  padding: "0"
});
const SingleDigit = styled("span")({
  display: "flex",
  flex: "0 1 25%",
  fontSize: "20px",
  fontWeight: "600",
  backgroundColor: "#10241B",
  border: "1px solid #C1D117",
  padding: "6px 4px",
  color: "white",
  textAlign:"center",
  justifyContent:"center",
  width: "100%",
  marginLeft: "5px",
  marginright: "5px"
});

const Stake = ({ onClickStakeState = () => { }, selectAll = false, onClick = () => { } }) => {
  let data = []
  let status = []
  const ids = useSelector((state) => state.NFT_ID);
  const [Landdata, setLandData] = useState([]);
  const [finishLoading, setFinishLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [openProgressModal, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const walletAddress = useSelector((state) => state.coinbaseAddress);
  const [selected, setSelected] = useState({});
  const [reward, setReward] = useState([])
  const rewardData = useSelector((state) => state.REWARD_RATES)

  const dispatch = useDispatch()

  const waterLand = async () => {
    try {
      if (walletAddress) {
        setTitle("Watering Lands...")
        setOpen(true)
        await waterLandFunc()
        setTimeout(() => {
          dispatch(setTimer(new Date()));  
        }, 1000);
  
        setTimeout(progressCloseModal, 2000);
      } else {
        alertify.error(String("Please connect to wallet"))
      }
      
    } catch (e) {
      setTimeout(setOpen(false), 1000);
      alertify.error(String(e))
    }
  }

  const harvest = async () => {
    try {
      await harvestFunc()
    } catch (e) {
      alertify.error(String(e))
    }
  }

  const unstake = async () => {
    try {
      if (walletAddress) {
        setTitle("Unstaking Lands...")
        setOpen(true)
        const selectedIds = Object.keys(selected).reduce((ret, cur) => {
          if (selected?.[cur]) {
            return [...(ret ?? []), cur]
          }
          return ret
        }, [])
        await unstakeFunc(selectedIds)
        onClickStakeState()
        initData()
      } else {
        alertify.error(String("Please connect to wallet"))
      }
      
    } catch (e) {
      setTimeout(setOpen(false), 1000);
      console.log(e)
      alertify.error(String(e))
    }
  }

  const changeState = (tokenId) => {
    setSelected((s = {}) => ({ ...(s ?? {}), [tokenId]: !s?.[tokenId] }))
  }

  const initData = async () => {
    try {
      data = await getTokenInfos(walletAddress, true, dispatch, rewardData);
      setLandData(s => data);
      status = await getStatusInfos();
      let rewards = await getRewardEstimate(walletAddress);
      setReward(rewards)
      setFinishLoading(true);
      setStatsData(s => status)
      setTimeout(progressCloseModal, 2000);
    } catch (e) {
      setTimeout(setOpen(false), 1000);
      alertify.error(String(e))
    }
  }
  useEffect(() => {
    if (walletAddress) {
      setTitle("Loading Staked Lands...")
      setOpen(true)
      initData()
    } else {
      alertify.error("Please Connect Wallet")
    }
  }, [walletAddress]);

  const progressCloseModal = () => {
    setOpen(false);
    alertify.success(String('All staked tokens are imported!'))
  };

  useEffect(() => {
    if (selectAll) {
      const tmp = (Array.isArray(ids) ? ids : []).reduce((ret, crr) => {
        return {
          ...ret,
          [crr]: true
        }
      }, {})
      setSelected((prev = {}) => ({
        ...(prev ?? {}),
        ...tmp
      }))
      onClick({ selectAll: false })
    }
  }, [selectAll])

  return (
    <Box
      sx={{
        paddingBottom: "0px",
        // marginRight: "-70px",
        // marginLeft: "-30px",
        paddingTop: "20px"
      }}
    >
      <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        {Landdata.map((item, index) => {
          return (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Box
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  border: `3px solid ${item.color}`,
                  boxShadow: `0px 0px 30px ${item.color}`,
                  paddingTop: "20px",
                  paddingX: "20px",
                  marginX: "10px",
                  marginBottom: "29px",
                  overflowY: "auto",
                  height: "600px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignSelf: "center",
                      paddingRight: "14px",
                    }}
                  >
                    <Title>{item.title}</Title>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignSelf: "center",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: item.color,
                        paddingX: "12px",
                        paddingY: "4px",
                        color: "#FFFFFF",
                        fontSize: "22px",
                        fontWeight: "700",
                        borderRadius: "5px",
                      }}
                    >
                      {item.quant}
                    </Box>
                  </Box>
                </Box>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                >
                  {item.data.map((itm, index) => {
                    const isActive = Boolean(selected?.[itm?.tokenId])
                    return (
                      <Grid item xs={6} key={index}>
                        <Box
                          sx={{
                            border: `2px solid ${isActive ? 'red' : item.color}`,
                            width: "90%",
                            height: "70%",
                            borderRadius: "8px",
                            overflow: "hidden",
                            marginBottom: "10px",
                          }}
                          onClick={() => changeState(itm.tokenId)}
                        >
                          <LuckyImage src={itm.picture} alt="" onClick={() => {}} />
                        </Box>
                        <Box
                          sx={{
                            border: `2px solid ${item.color}`,
                            width: "90%",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                            fontSize: "10px",
                            lineHeight: "15px",
                            fontWeight: "800",
                            paddingX: "5px",
                            paddingY: "5px",
                            height: "42px",
                            textAlign: "center",
                            overflow: "hidden",
                          }}
                        >
                          {itm.price1}
                          <br></br>
                          {itm.price2}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>
          );
        })}
        {finishLoading && (
          <Grid item xs={12} sm={6} lg={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box>
                <Box
                  sx={{
                    backgroundColor: "#10241b",
                    paddingX: "10px",
                    paddingY: "10px",
                    Width: "360px",
                  }}
                >
                  <StatTitle>Clover Stats</StatTitle>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingBottom: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          color: "#ffffff",
                          paddingX: "12px",
                          borderRight: "2px solid #c1d117",
                          textTransform: "uppercase",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        MINTED
                      </Box>
                      <Box
                        sx={{
                          color: "#ffffff",
                          paddingX: "12px",
                          textTransform: "uppercase",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        STAKED
                      </Box>
                    </Box>
                  </Box>
                  {statsData.map((item, index) => {
                    return (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          paddingX: "1px",
                          marginY: "7px",
                        }}
                        key={index}
                      >
                        <Box>
                          <Box
                            sx={{
                              backgroundColor: "#c1d117",
                              color: "#0d1f19",
                              paddingY: "5px",
                              paddingX: "10px",
                              textTransform: "uppercase",
                              fontSize: "12px",
                              fontWeight: "700",
                              borderTopLeftRadius: "8px",
                              borderBottomLeftRadius: "8px",
                            }}
                          >
                            {item.title}
                            <br />
                            {item.subTitle}
                          </Box>
                        </Box>
                        <Box>
                          <Box
                            sx={{
                              backgroundColor: "#c1d117",
                              color: "#0d1f19",
                              paddingX: "10px",
                              paddingY: "5px",
                              textTransform: "uppercase",
                              fontSize: "12px",
                              fontWeight: "600",
                              textAlign: "center",
                              maxWidth: "100px",
                              minWidth: "80px",
                              "& > span": {
                                color: `#FFFFFF`,
                              },
                            }}
                          >
                            {item.minted}
                            <br />
                            <span>{item.mintedSlash}</span>
                          </Box>
                        </Box>
                        <Box>
                          <Box
                            sx={{
                              backgroundColor: "#c1d117",
                              color: "#fff",
                              minWidth: "80px",
                              maxWidth: "120px",
                              paddingX: "10px",
                              paddingY: "7.5px",
                              textTransform: "uppercase",
                              fontSize: "20px",
                              fontWeight: "600",
                              textAlign: "center",
                              borderTopRightRadius: "8px",
                              borderBottomRightRadius: "8px",
                            }}
                          >
                            {item.STAKED}
                          </Box>
                        </Box>
                      </Stack>
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#10241b",
                    paddingX: "4px",
                    maxWidth: "360px"
                  }}
                >
                  <StatTitle>MY REWARDS</StatTitle>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    <DigitContainer>
                          <SingleDigit>{reward[7]}</SingleDigit>
                          <SingleDigit>{reward[6]}</SingleDigit>
                          <SingleDigit>{reward[5]}</SingleDigit>
                          <SingleDigit>{reward[4]}</SingleDigit>
                          <SingleDigit>{reward[3]}</SingleDigit>
                          <SingleDigit>{reward[2]}</SingleDigit>
                          <SingleDigit>{reward[1]}</SingleDigit>
                          <SingleDigit>{reward[0]}</SingleDigit>
                    </DigitContainer>          
                  </Box>
                  
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginY: "30px",
                    maxWidth: "200px",
                    marginX: "auto",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: "10px",
                      }}
                    >
                      <Button title="WATER LAND$" color="#c1d117" onClick={waterLand} />
                    </Box>
                    <Box
                      sx={{
                        marginBottom: "10px",
                      }}
                    >
                      <Button title="HARVEST SEED$" color="#00a65a" onClick={harvest} />
                    </Box>
                    <Box
                      sx={{
                        marginBottom: "10px",
                      }}
                    >
                      <Button title="UNSTAKE" color="#3c6f66" onClick={unstake} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
      <ProgresModal
        openProgressModal={openProgressModal}
        progressCloseModal={progressCloseModal}
        title= {title}
      />
    </Box>
  );
};

export default Stake;

const Button = ({ color, title, onClick = () => { } }) => {
  return (
    <a onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "60px",
        color: "#fff",
        border: `3px solid ${color}`,
        boxShadow: `0px 0px 18px ${color}`,
        borderRadius: "6px",
        fontSize: "20px",
        cursor: "pointer",
        textTransform: "uppercase",
        fontWeight: "700",
        fontFamily: `Maven Pro, sans-serif`,
        textDecoration: "none",
        marginTop: "10px"
      }}
    >
      {title}
    </a>
  );
};
