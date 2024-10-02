"use client"; // Add this line at the top to mark the file as a Client Component

import { useState, useEffect } from "react";
import { Box, Button, VStack, Text, Image, Spinner, Grid, GridItem, useToast } from "@chakra-ui/react";
import { FaHeart, FaShareAlt } from "react-icons/fa";

interface Meme {
  title: string;
  url: string;
  postLink: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadMemes();
    const storedLikes = localStorage.getItem("likedMemes");
    if (storedLikes) {
      setLikedMemes(JSON.parse(storedLikes));
    }
  }, []);

  const loadMemes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://meme-api.com/gimme/20`);
      const data = await res.json();
      setMemes(data.memes);
    } catch (error) {
      console.error("Failed to fetch memes", error);
    }
    setLoading(false);
  };

  const handleLike = (meme: Meme) => {
    const newLikedMemes = [...likedMemes, meme.postLink];
    setLikedMemes(newLikedMemes);
    localStorage.setItem("likedMemes", JSON.stringify(newLikedMemes));
    toast({
      title: "Meme Liked!",
      description: "This meme has been added to your favorites.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShare = (meme: Meme) => {
    navigator.clipboard.writeText(meme.postLink);
    toast({
      title: "Link Copied!",
      description: "Meme link copied to clipboard.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={6} p={4}>
      <Text fontSize="2xl" fontWeight="bold">Meme Drunk</Text>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
        {memes.map((meme, index) => (
          <GridItem key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" transition="transform 0.2s" _hover={{ transform: "scale(1.05)" }}>
            <Text p={2} fontWeight="bold">{meme.title}</Text>
            <Image src={meme.url} alt={meme.title} width="100%" />
            <Box p={4} display="flex" justifyContent="space-between">
              <Button onClick={() => handleLike(meme)} leftIcon={<FaHeart />} colorScheme={likedMemes.includes(meme.postLink) ? "red" : "blue"}>
                {likedMemes.includes(meme.postLink) ? "Liked" : "Like"}
              </Button>
              <Button onClick={() => handleShare(meme)} leftIcon={<FaShareAlt />}>Share</Button>
            </Box>
          </GridItem>
        ))}
      </Grid>
      {loading && <Spinner />}
    </VStack>
  );
}
