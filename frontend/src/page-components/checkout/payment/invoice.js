import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import ServiceApi from 'lib/service-api';
import { Button } from 'ui';
import { useTranslation } from 'next-i18next';

function Form({ checkoutModel, onSuccess, onError }) {
  const { t } = useTranslation('checkout');
  const [status, setStatus] = useState('idle');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('confirming');
    go();
    async function go() {
      
      const response = await ServiceApi({
        query: `
          mutation InoiceCreateOrder($checkoutModel: CheckoutModelInput!) {
            paymentProviders {
              invoice {
                createInvoice(checkoutModel: $checkoutModel) {
                  success
                  orderId
                }
              }
            }
          }
        `,
        variables: {
          checkoutModel
        }
      });

      const {
        success,
        orderId
      } = response.data.paymentProviders.invoice.createInvoice;

      if (success) {
        onSuccess(orderId);
      } else {
        onError();
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginTop: 25 }}>
        <Button
          type="submit"
          state={status === 'confirming' ? 'loading' : null}
          disabled={status === 'confirming'}
        >
          {t('payNow')}
        </Button>
      </div>
    </form>
  );
}

export default function InvoiceWrapper({ checkoutModel, ...props }) {

  return (
    <>
      <Head>

      </Head>
        <Form
          {...props}
          checkoutModel={checkoutModel}
        />
    </>
  );
}
