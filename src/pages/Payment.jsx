import React from 'react';
import styled from 'styled-components';

const PaymentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f7f9fc;
  border-radius: 16px;
  padding: 3rem;
  margin: 2rem;
  margin-top: 10rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const PaypalButton = styled.a`
  background: linear-gradient(to bottom, #80f3a8 0%, #accf94 100%);
  color: #111;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 280px;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    background: linear-gradient(to bottom, #accf94 0%, #80f3a8 100%);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PaypalLogo = styled.img`
  height: 60px;
  width: auto;
  margin-bottom: 0.5rem;
`;

const ButtonText = styled.span`
  font-size: 1.3rem;
  letter-spacing: 0.5px;
`;

const SecureBadge = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &::before {
    content: "🔒";
    font-size: 1rem;
  }
`;

function Payment() {
    const paypalPaymentLink = "https://www.paypal.com/paypalme/yourusername";

    return (
        <PaymentContainer>
            <PaypalButton 
                href={paypalPaymentLink} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <PaypalLogo 
                    src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png" 
                    alt="PayPal" 
                />
                <ButtonText>Pay with PayPal</ButtonText>
                <SecureBadge>Secure Payment</SecureBadge>
            </PaypalButton>
        </PaymentContainer>
    );
}

export default Payment;