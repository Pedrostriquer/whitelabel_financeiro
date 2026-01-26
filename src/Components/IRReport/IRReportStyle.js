import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background-color: #f4f7f6;
`;

export const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

export const IconWrapper = styled.div`
  font-size: 3.5rem;
  color: #27ae60;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
`;

export const Description = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

export const DownloadButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
