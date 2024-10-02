"use client"; // Add this line at the top to mark the file as a Client Component

import { useState, useEffect } from "react";
import { Box, Button, VStack, Text, Image, Spinner, Input, useToast, useColorModeValue } from "@chakra-ui/react";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkzgZhd4Tfa5LqQo2nYh25H0Sib3cksDA",
  authDomain: "memedrunk-d9662.firebaseapp.com",
  projectId: "memedrunk-d9662",
  storageBucket: "memedrunk-d9662.appspot.com",
  messagingSenderId: "539248007949",
  appId: "1:539248007949:web:7db8fc9afbf25a9e7a2e44",
  measurementId: "G-TTSYTV0420"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

interface Meme {
  title: string;
  url: string;
  postLink: string;
}

interface Comment {
  memeTitle: string;
  username: string;
  text: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>("");

  const toast = useToast();
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const buttonBg = useColorModeValue("blue.400", "blue.600");

  useEffect(() => {
    loadMemes();
    loadLikes();
    loadComments();
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

  const loadLikes = () => {
    const storedLikes = localStorage.getItem("likes");
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    }
  };

  const loadComments = async () => {
    const commentSnapshot = await getDocs(collection(db, "comments"));
    const loadedComments: Comment[] = commentSnapshot.docs.map(doc => doc.data() as Comment);
    setComments(loadedComments);
  };

  const handleLike = (meme: Meme) => {
    const updatedLikes = { ...likes, [meme.title]: (likes[meme.title] || 0) + 1 };
    setLikes(updatedLikes);
    localStorage.setItem("likes", JSON.stringify(updatedLikes));
    toast({
      title: "Liked!",
      description: "You have liked this meme.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleComment = async (meme: Meme) => {
    if (!loggedInUser) {
      toast({
        title: "Login Required",
        description: "Please log in to comment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (commentText.trim()) {
      const newComment: Comment = { memeTitle: meme.title, username: loggedInUser, text: commentText };
      setComments([...comments, newComment]);
      setCommentText("");

      // Save comment to Firestore
      await addDoc(collection(db, "comments"), newComment);
    } else {
      toast({
        title: "Empty Comment",
        description: "You cannot post an empty comment.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleShare = (meme: Meme) => {
    navigator.clipboard.writeText(meme.postLink);
    alert("Link copied to clipboard!");
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setLoggedInUser(user.displayName || user.email);
      toast({
        title: "Logged in!",
        description: `Welcome, ${user.displayName || user.email}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: "Unable to log in with Discord.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} p={4}>
      {loggedInUser ? (
        <Text>Welcome, {loggedInUser}!</Text>
      ) : (
        <Button onClick={handleLogin} bg={buttonBg} color="white">
          Login with Google
        </Button>
      )}
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
                onClick={() => handleLike(meme)}
                leftIcon={<FaHeart />}
                bg={buttonBg}
                color="white"
                _hover={{ bg: "red.500" }}
                _active={{ bg: "red.600", transform: "scale(0.95)" }}
                transition="transform 0.2s"
              >
                Like ({likes[meme.title] || 0})
              </Button>
              <Button
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
            <Box p={4}>
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!loggedInUser}
              />
              <Button
                onClick={() => handleComment(meme)}
                mt={2}
                isDisabled={!loggedInUser}
                bg={buttonBg}
                color="white"
                _hover={{ bg: "green.500" }}
                _active={{ bg: "green.600", transform: "scale(0.95)" }}
                transition="transform 0.2s"
              >
                Post Comment
              </Button>
              {comments
                .filter((comment) => comment.memeTitle === meme.title)
                .map((comment, idx) => (
                  <Text key={idx} mt={2}>
                    {comment.username}: {comment.text}
                  </Text>
                ))}
            </Box>
          </Box>
        </motion.div>
      ))}
      {loading && <Spinner size="xl" thickness="4px" speed="0.65s" color={buttonBg} />}
      <Button onClick={() => setPage((prev) => prev + 1)} mt={6}>
        Load More Memes
      </Button>
    </VStack>
  );
}
