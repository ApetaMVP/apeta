import {
  ActionIcon,
  AspectRatio,
  Button,
  Box,
  Card,
  Center,
  Group,
  Stack,
  Text,
  CardSection,
} from "@mantine/core";
import { Form } from "@remix-run/react";
import { IconHeart, IconMessage } from "@tabler/icons";
import sanitizedSearch from "~/utils/helpers";
import { FypPost } from "~/utils/types";
import AvatarName from "./AvatarName";

interface FypPostCardProps {
  post: FypPost;
  loggedIn: boolean;
}

export default function FypPostCard(props: FypPostCardProps) {
  const { post, loggedIn } = props;

  const optimisticUpdate = async () => {
    if (!post.iLiked) {
      post.iLiked = true;
      post.likeCount++;
    } else {
      post.iLiked = false;
      post.likeCount--;
    }
  };

  return (
    <Group w="100%" noWrap position="center">
      <Card w="80%" shadow="none">
        <CardSection>
          <Group  position="center" mt="sm" mb="xs">
        <AvatarName
            name={post.author.username}
            avatarUrl={post.author.avatarUrl}
          />
          </Group>
        </CardSection>
        <Card.Section>
          <AspectRatio ratio={16 / 9}>
            <video controls src={post.mediaUrl} />
          </AspectRatio>
        </Card.Section>
        <Card.Section>
        <Group position="center">
        <Stack mt="xs" align= "center" >
       
      {!loggedIn && (
          <Box >
            
            <ActionIcon disabled>
              <IconHeart />
            </ActionIcon>
            
              <Text fz="sm" c="gray" align="center">
                {post.likeCount}
              </Text>
           
            <Form method="get" action={`/site/post/${post.id}`}>
              <ActionIcon type="submit">
                <IconMessage color="black" />
              </ActionIcon>
              
                <Text fz="sm" c="gray">
                  {post.feedbackCount}
                </Text>
             
            </Form>
            <Form
              method="post"
              action="/site/for-you"
              onClick={optimisticUpdate}
            >
              <ActionIcon type="submit" name="postId" value={post.id}>
                <IconHeart color="red" fill={post.iLiked ? "red" : "white"} />
              </ActionIcon>
            </Form>
            
              <Text fz="sm" c="gray">
                {post.likeCount}
              </Text>
           
            <Form method="get" action={`/site/post/${post.id}`}>
              <ActionIcon type="submit">
                <IconMessage color="black" />
              </ActionIcon>
              
                <Text fz="sm" c="gray">
                  {post.feedbackCount}
                </Text>
             
            </Form>
          </Box>
        )}
        {loggedIn && (
          <Box>
            <Form
              method="post"
              action="/site/for-you"
              onClick={optimisticUpdate}
            >
              <ActionIcon type="submit" name="postId" value={post.id}>
                <IconHeart color="red" fill={post.iLiked ? "red" : "white"} />
              </ActionIcon>
            </Form>
            
              <Text fz="sm" c="gray">
                {post.likeCount}
              </Text>
           
            <Form method="get" action={`/site/post/${post.id}`}>
              <ActionIcon type="submit">
                <IconMessage color="black" />
              </ActionIcon>
              
                <Text fz="sm" c="gray">
                  {post.feedbackCount}
                </Text>
             
            </Form>
          </Box>
        )}
        
        
      </Stack>
      </Group>
      </Card.Section>
        <Stack mt="xs">
        
          <Text align="center">{post.content}</Text>
          <Group>
            {post.tags.map((t) => (
              <Text
                key={t}
                truncate
                fw={700}
                style={{ cursor: "pointer" }}
                onClick={(_e) =>
                  (window.location.href = `/site/for-you?searchTerm=${sanitizedSearch(
                    t,
                  )}`)
                }
              >
                {t}
              </Text>
            ))}
          </Group>
        </Stack>
      </Card>
     
    </Group>
  );
}
