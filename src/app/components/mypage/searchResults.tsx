'use client';
import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { videoDataState } from "@/app/states/videoDataState";
import { Data, Item } from "@/types";
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

const YOUTUBE_SEARCH_API_URI = "https://www.googleapis.com/youtube/v3/search";
const youtubeUrl = "https://www.youtube.com/watch?v=";
const channelUrl = "https://www.youtube.com/channel/";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const formatDate = (publishedAt: string) => {
  const date = new Date(publishedAt);
  return date.toLocaleString("ja-JP");
};

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [videoData, setVideoData] = useRecoilState(videoDataState);
  const router = useRouter();

  const fetchVideos = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!API_KEY) {
      console.error("API_KEY is undefined");
      return;
    }

    //クエリ文字列を整理する
    const params = {
      key: API_KEY,
      part: "snippet",
      q: searchTerm, //検索ワード
      type: "video",
      maxResults: "10", //表示する動画数
      order: "relevance", //デフォルトの並び順
    };
    const queryParams = new URLSearchParams(params);

    try {
      const response = await fetch(
        `${YOUTUBE_SEARCH_API_URI}?${queryParams.toString()}`
      );
      const result = await response.json();
      if (result.items) {
        setVideoData(result.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(videoData);
  }, [videoData]);



  return (
    <Stack gap="3rem">
      <Box>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="検索ワードを入力"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchVideos}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ m: 1 }}
        />
      </Box>

      <Box>
        <Typography>検索結果</Typography>
        <Box
          height="15rem"
          sx={{
            width: "100%",
            border: 1,
          }}
        >
          {videoData?.map((item: Item, index: number) => (
            <Box className="item" key={index}>
              <Box className="thumbnail">
                {/* <Link onClick={()=> ClicktoWatchVideo(item.id)}>
                 */}
                <Link href={"searchResults/" + item.id.videoId + "/watch"}>
                  <img
                    src={item.snippet?.thumbnails?.medium?.url}
                    alt={item.snippet?.title}
                  />
                </Link>
              </Box>
              <Box className="right">
                <Box className="title">
                  <Link href={"searchResults/" + item.id.videoId + "/watch"}>
                    {item.snippet?.title}
                  </Link>
                </Box>
                <Box className="description">{item.snippet?.description}</Box>
                <Box className="channel">
                  <Link href={"searchResults/" + item.id.videoId + "/watch"}>
                    {item.snippet?.channelTitle}
                  </Link>
                </Box>
                <Box className="time">
                  {formatDate(item.snippet?.publishedAt)}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
};

export default SearchResults;