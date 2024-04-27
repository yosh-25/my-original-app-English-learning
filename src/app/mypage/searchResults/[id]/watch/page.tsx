"use client";

import React, { useState, useEffect, useContext } from "react";
import { Data, Item, counterState } from "@/types";
import { videoDataState } from "@/app/states/videDataState";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { Memo, MemoList } from "@/types";
import YouTube from "react-youtube";

// todo: 次回reduxで前のページからtitle等情報を取得&画面に表示

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const watch = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [YTPlayer, setYTPlayer] = useState<YT.Player>();
  const [currentTime, setCurrentTime] = useState<number>();
  const [memoList, setMemoList] = useState<MemoList>();
  const videoData = useRecoilValue(videoDataState);
  const counter = useRecoilValue(counterState);

  const opts = {
    width: "70%",
    height: "400px",
    aspectRatio: "0.5",
  };

  const makeYTPlayer = (e: { target: YT.Player }) => {
    setYTPlayer(e.target);
  };

  const recordCurrentTime = () => {
    setCurrentTime(YTPlayer?.getCurrentTime());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (YTPlayer && YTPlayer.getCurrentTime) {
        setCurrentTime(YTPlayer.getCurrentTime());
      }
    }, 1000); // Update time every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [YTPlayer]);

  const fetchVideoInfo = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log(videoData);

    if (!videoData || !videoData.items || videoData.items.length === 0) {
      console.log("No video data available or items array is empty");
    } else {
      videoData.items.forEach((item) => console.log(item.snippet));
    }
    console.log("aa");
  };

  useEffect(() => {
    console.log(videoData);
  }, []);

  return (
    <Box>
      <Box height="100%">
        <YouTube videoId={id} opts={opts} onReady={makeYTPlayer} />

        <Typography></Typography>
      </Box>
      <Button onClick={recordCurrentTime}>
        <Typography sx={{ border: 1, padding: "1rem", marginBottom: "1rem" }}>
          {currentTime?.toFixed(0)}秒にメモを作成します＋
        </Typography>
      </Button>
      <Button>
        <Typography sx={{ border: 1, padding: "1rem", marginBottom: "1rem" }}>
          {videoData?.items?.map((item, index) => (
            <div key={index}>
              <p>{item.snippet.title}</p>
              <p>aaa</p>
            </div>
          ))}
          aa
        </Typography>
      </Button>
      <TableContainer sx={{ marginBottom: "50px" }}>
        <Typography variant="h3" fontWeight="650" sx={{ fontSize: "1rem" }}>
          React入門
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">再生位置</TableCell>
              <TableCell align="left">メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>15:15</TableCell>
              <TableCell>useStateの書き方と注意事項</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>20:00</TableCell>
              <TableCell>
                useEffectで特定のuseStateが変更されたときにレンダリングする方法
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default watch;
