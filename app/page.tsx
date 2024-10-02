"use client";// app/page.tsx

import { useEffect, useState } from "react";
import { ChakraProvider, Box, Button, Flex, Image, Text, VStack, Heading, HStack } from "@chakra-ui/react";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import localFont from "next/font/local";
import "./global.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [memes, setMemes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    const response = await fetch("https://meme-api.com/gimme/10");
    const data = await response.json();
    setMemes(data.memes);
  };

  const toggleFavorite = (url: string) => {
    if (favorites.includes(url)) {
      const updatedFavorites = favorites.filter((fav) => fav !== url);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, url];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const shareMeme = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this meme!',
        url,
      });
    } else {
      alert('Sharing not supported on this browser.');
    }
  };

  return (
    <ChakraProvider>
      <Box className={`${geistSans.variable} ${geistMono.variable}`} p={5}>
        <Flex justify="space-between" align="center" mb={5}>
          <Heading size="lg">Meme Drunk</Heading>
          <HStack spacing={4}>
            <Button variant="outline" onClick={() => {/* Navigate to favorites */}}>
              <FaStar /> Favorites
            </Button>
          </HStack>
        </Flex>

        <Flex wrap="wrap" justify="center">
          {memes.map((meme) => (
            <VStack key={meme.url} borderRadius="md" overflow="hidden" boxShadow="md" m={2}>
              <Image src={meme.url} alt={meme.title} borderRadius="md" boxSize="300px" objectFit="cover" />
              <Text>{meme.title}</Text>
              <HStack spacing={4} p={2}>
                <Button onClick={() => toggleFavorite(meme.url)} colorScheme="teal">
                  <FaHeart /> {favorites.includes(meme.url) ? 'Unlike' : 'Like'}
                </Button>
                <Button onClick={() => shareMeme(meme.url)} colorScheme="blue">
                  <FaShareAlt /> Share
                </Button>
              </HStack>
            </VStack>
          ))}
        </Flex>
      </Box>
    </ChakraProvider>
  );
}
