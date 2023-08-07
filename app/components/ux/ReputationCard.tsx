import {
    ActionIcon,
    AspectRatio,
    Badge,
    Button,
    Box,
    Card,
    Center,
    Image,
    Group,
    Stack,
    Space,
    Text,
    CardSection,
    Container,
    Grid
  } from "@mantine/core";

export default function ReputationCard (){ 

return( 
    <Group>
        <Card withBorder shadow="sm" radius="md" w="100%">
        <Group position="apart">
            <Card.Section>
                
                <Image
                m="sm"
                fit="contain"
                src="https://paybycourts3.s3.amazonaws.com/uploads/user/avatar/555706/desktop_square_Alex_Photo.jpg"
                alt="Alex Ovchinnikov"
                height={200}
                />
                
               


            </Card.Section>
           
            <Card.Section w="50%">
            <Text
            m="sm"
            lineClamp={9}
            >
                Hey! My name is Alex Ovchinnikov and this will be my second year coaching tennis at NHSTC. I am excited to 
                keep growing the tennis community here and getting everyone on a court and playing.  I believe that tennis 
                is a lifelong sport and a lifelong learning experience that every age and skill level can learn! I look forward to teaching the skillset of tennis to anyone interested and preparing any competitive players for their next goal or competition.
                </Text>
           

            </Card.Section>

            </Group>
            <Group>
                <Badge>Avg Response Time: 12 Hours</Badge>
               
            </Group>
            <CardSection>
                <div>
                    <br></br>
                </div>
            </CardSection>
            <Group>
            <Badge color="cyan">Expert Provided Response Time: 24 Hours</Badge>
            </Group>
            <CardSection>
                <div>
                    <br></br>
                </div>
            </CardSection>
            <Group position="right" grow>
                <Badge color="grape">Most Helpful Comments: 2</Badge>
                <Badge color="green">Up Voted Video Comments: 10</Badge>
                
            </Group>
            <CardSection>
                <div>
                    <br></br>
                </div>
            </CardSection>
            <Group position="left" grow>
            <Badge color="orange">Apeta Score: 18</Badge>

            </Group>
            <Group position="apart">
                <Card.Section>
                <AspectRatio ratio={16 / 9}>
                <video controls src=""/>
                </AspectRatio>

                </Card.Section>
                <AspectRatio ratio={16 / 9}>
                <video controls src=""/>
                </AspectRatio>
                <Card.Section>

                </Card.Section>

            </Group>
            <Group position="apart" mt="md" mb="xs">
            <Button color="violet">
                Book a lesson
            </Button>
            <Button
            color="lime"
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href="https://newporthillsswimtennisclub.com/pros/alex-ovchinnikov">
                Visit Site                
            </Button>
            </Group>
        </Card>

    </Group>
);

}
