"use client"; // Add this line at the top to mark the file as a Client Component

import { useState, useEffect } from "react";
import { Box, Button, VStack, Text, Image, Spinner, useColorModeValue } from "@chakra-ui/react";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface Meme {
  title: string;
  url: string;
  postLink: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const boxBg = useColorModeValue("gray.50", "gray.700");
  const buttonBg = useColorModeValue("blue.400", "blue.600");

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
    // Like functionality
  };

  const handleComment = () => {
    // Comment functionality
  };

  const handleShare = (meme: Meme) => {
    navigator.clipboard.writeText(meme.postLink);
    alert("Link copied to clipboard!");
  };

  return (
    <VStack spacing={6} p={4}>
      {memes.map((meme, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <Box
            bg={boxBg}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            transition="all 0.2s"
            _hover={{ shadow: "lg" }}
            w="100%"
            maxW="500px"
          >
            <Text p={2} fontWeight="bold">{meme.title}</Text>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image src={meme.url} alt={meme.title} width="100%" />
            </motion.div>
            <Box p={4} display="flex" justifyContent="space-between">
              <Button
                onClick={handleLike}
                leftIcon={<FaHeart />}
                bg={buttonBg}
                color="white"
                _hover={{ bg: "red.500" }}
                _active={{ bg: "red.600", transform: "scale(0.95)" }}
                transition="transform 0.2s"
              >
                Like
              </Button>
              <Button
                onClick={handleComment}
                leftIcon={<FaComment />}
                bg={buttonBg}
                color="white"
                _hover={{ bg: "green.500" }}
                _active={{ bg: "green.600", transform: "scale(0.95)" }}
                transition="transform 0.2s"
              >
                Comment
              </Button>
              <Button
                onClick={() => handleShare(meme)}
                leftIcon={<FaShareAlt />}
                bg={buttonBg}
                color="white"
                _hover={{ bg: "blue.500" }}
                _active={{ bg: "blue.600", transform: "scale(0.95)" }}
                transition="transform 0.2s"
              >
                Share
              </Button>
            </Box>
          </Box>
        </motion.div>
      ))}
      {loading && <Spinner size="xl" thickness="4px" speed="0.65s" color={buttonBg} />}
      <Button
        onClick={() => setPage(page + 1)}
        isDisabled={loading}
        bg={buttonBg}
        color="white"
        _hover={{ bg: "blue.500" }}
        _active={{ bg: "blue.600", transform: "scale(0.95)" }}
        transition="transform 0.2s"
      >
        Load More
      </Button>
    </VStack>
  );
}
