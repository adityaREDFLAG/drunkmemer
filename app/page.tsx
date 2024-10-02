"use client"; // Add this line at the top to mark the file as a Client Component

import { useState, useEffect } from "react";
import { Box, Button, VStack, Text, Image, Spinner } from "@chakra-ui/react";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";

interface Meme {
  title: string;
  url: string;
  postLink: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadMemes();
  }, [page]);

  const loadMemes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://meme-api.com/gimme/20`);
      const data = await res.json();
      setMemes((prev) => [...prev, ...data.memes]);
    } catch (error) {
      console.error("Failed to fetch memes", error);
    }
    setLoading(false);
  };

  const handleLike = () => {
    // Like functionality (to be implemented)
  };

  const handleComment = () => {
    // Comment functionality (to be implemented)
  };

  const handleShare = (meme: Meme) => {
    navigator.clipboard.writeText(meme.postLink);
    alert("Link copied to clipboard!");
  };

  return (
    <VStack spacing={6} p={4}>
      {memes.map((meme, index) => (
        <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" maxW="500px">
          <Text p={2} fontWeight="bold">{meme.title}</Text>
          <Image src={meme.url} alt={meme.title} width="100%" />
          <Box p={4} display="flex" justifyContent="space-between">
            <Button onClick={handleLike} leftIcon={<FaHeart />}>Like</Button>
            <Button onClick={handleComment} leftIcon={<FaComment />}>Comment</Button>
            <Button onClick={() => handleShare(meme)} leftIcon={<FaShareAlt />}>Share</Button>
          </Box>
        </Box>
      ))}
      {loading && <Spinner />}
      <Button onClick={() => setPage(page + 1)} isDisabled={loading}>
        Load More
      </Button>
    </VStack>
  );
}
