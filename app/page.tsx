"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Image,
  IconButton,
  useToast,
  SimpleGrid,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { css } from "@emotion/react";

interface Meme {
  title: string;
  url: string;
  postLink: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [favorites, setFavorites] = useState<Meme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    loadMemes();
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
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
    const updatedFavorites = [...favorites, meme];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast({
      title: "Meme added to favorites.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShare = (meme: Meme) => {
    navigator.clipboard.writeText(meme.postLink);
    toast({
      title: "Link copied to clipboard!",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={6} p={4} align="center">
      <Heading mb={6} color="purple.500" fontSize="2xl">
        Meme Drunk
      </Heading>

      {/* Meme Grid */}
      <SimpleGrid columns={[1, 2, 3]} spacing={6} w="full" maxW="1200px">
        {memes.map((meme, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="gray.100"
              p={4}
              css={css`
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                &:hover {
                  transform: translateY(-5px);
                }
              `}
            >
              <Image
                src={meme.url}
                alt={meme.title}
                width="100%"
                borderRadius="md"
                mb={4}
              />
              <Text fontWeight="bold" mb={2}>
                {meme.title}
              </Text>
              <Box display="flex" justifyContent="space-between">
                <IconButton
                  aria-label="Like"
                  icon={<FaHeart />}
                  onClick={() => handleLike(meme)}
                  colorScheme="red"
                  variant="ghost"
                />
                <IconButton
                  aria-label="Share"
                  icon={<FaShareAlt />}
                  onClick={() => handleShare(meme)}
                  colorScheme="blue"
                  variant="ghost"
                />
              </Box>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>

      {/* Favorites Tab */}
      <Heading mt={12} mb={6} color="teal.400" fontSize="xl">
        Favorites
      </Heading>
      {favorites.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={6} w="full" maxW="1200px">
          {favorites.map((meme, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="yellow.100"
              p={4}
            >
              <Image
                src={meme.url}
                alt={meme.title}
                width="100%"
                borderRadius="md"
                mb={4}
              />
              <Text fontWeight="bold" mb={2}>
                {meme.title}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No favorites yet. Like some memes to add them!</Text>
      )}
    </VStack>
  );
}
