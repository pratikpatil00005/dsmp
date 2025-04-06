import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Button, Stack, Text, Group, Card } from '@mantine/core';
import { useAuth } from '../lib/auth';

interface ReviewExpression {
  id: string;
  expression: string;
  timestamp: string;
  result: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reviewExpressions, setReviewExpressions] = useState<ReviewExpression[]>([]);

  useEffect(() => {
    // Fetch user's past review expressions
    const fetchReviewExpressions = async () => {
      try {
        const response = await fetch('/api/review-expressions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setReviewExpressions(data);
        }
      } catch (error) {
        console.error('Error fetching review expressions:', error);
      }
    };

    fetchReviewExpressions();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Title order={2}>Profile</Title>
          <Button color="red" onClick={handleLogout}>Logout</Button>
        </Group>

        <Paper p="md" withBorder>
          <Stack spacing="md">
            <Title order={3}>User Information</Title>
            <Text>Email: {user?.email}</Text>
            <Text>Name: {user?.name}</Text>
          </Stack>
        </Paper>

        <Paper p="md" withBorder>
          <Stack spacing="md">
            <Title order={3}>Past Review Expressions</Title>
            {reviewExpressions.length === 0 ? (
              <Text color="dimmed">No review expressions found.</Text>
            ) : (
              reviewExpressions.map((expr) => (
                <Card key={expr.id} withBorder>
                  <Stack spacing="xs">
                    <Text weight={500}>Expression: {expr.expression}</Text>
                    <Text size="sm" color="dimmed">Result: {expr.result}</Text>
                    <Text size="sm" color="dimmed">
                      Date: {new Date(expr.timestamp).toLocaleDateString()}
                    </Text>
                  </Stack>
                </Card>
              ))
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Profile; 