import { Center, Stack, Text, Title } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { IconCloud, IconUpload, IconX } from "@tabler/icons";

export default function FileUpload(props: Partial<DropzoneProps>) {
  return (
    <Dropzone
      onDrop={(files) => console.log("accepted files", files)}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={50 * 1024 ** 2} // 50 mb
      accept={["video/mp4", "video/mpeg", "video/webm", "video/quicktime"]}
      {...props}
    >
      <Stack>
        <Center>
          <Dropzone.Accept>
            <IconUpload size="20%" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size="20%" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconCloud size="20%" />
          </Dropzone.Idle>
        </Center>
        <Title order={3} align="center">
          Select video to upload
        </Title>
        <Text size="xl" align="center" c="dimmed" fz="sm">
          Drag or click here to upload a video
        </Text>
        <Text size="xl" align="center" c="dimmed" fz="sm">
          Must be less than 100MB
        </Text>
      </Stack>
    </Dropzone>
  );
}
