import { Button,  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Table,  Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useModalControl } from "../../shared/lib/use-modal-control.js";
import { format } from 'date-fns';

function Koribchiqish() {


  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Пользователь не авторизован');
        return;
      }
      setLoading(true)
      try {
        const response = await fetch(`https://ventum-internship-backend.bis-apps.com/api/main-laboratorian-purchase-orders/by-status/4/pagination/0`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        setData(data.data);

      } catch (error) {
        toast({
          title: 'Error',
          description: 'An error occurred while fetching data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);


  const detailsModalControl = useModalControl()

  const handleClickDetails = (item) => {
    detailsModalControl.open({ item })
  }


  return (
    <div>
      <div>
        <Text mt="2" color="green.500" fontSize="xl">Ko'rib chiqish 'Bosh laborant'</Text>
        <Table mt="2" variant="striped">
          {data.length > 0 && <Thead>
            <Tr >
              <Th>Sr.</ Th>
              <Th>DocNum</Th>
              <Th>cardName</Th>
              <Th>docDate</Th>
              <Th>docDueDate</Th>
              <Th>itemDescription</Th>
            </Tr>
          </Thead>}

          <Tbody >
            {loading ? (
              <Spinner size="md" />
            ) : error ? (
              <Text>Error: {error.message}</Text>
            ) : (
              data?.map((item, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{item?.docNum}</Td>
                  <Td>{item?.cardName}</Td>
                  <Td>{format(new Date(item?.docDate), 'dd.MM.yyyy')}</Td>
                  <Td>{format(new Date(item?.docDueDate), 'dd.MM.yyyy')}</Td>
                  <Td>{item?.documentLines[0].itemDescription}</Td>
                  <Td>
                    <Button color={"white"} colorScheme='blue' onClick={() => handleClickDetails(item)}>
                      Details
                    </Button>
                  </Td>

                </Tr>
              ))
            )}

          </Tbody>
        </Table>
      </div>

      <Details modalControl={detailsModalControl} />
    </div>
  )
}

export default Koribchiqish




export const Details = ({ modalControl }) => {

  const toast = useToast()
  const [loading, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null)


  const { state, close } = modalControl

  const { item } = state

  const getContent = () => {
    if (!state.visible) {
      return <></>
    }

    //Ruxsat
    const handleRuxsat = (params) => {
      const fetchButton = async (params) => {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Пользователь не авторизован');
          return;
        }

        setLoadingSearch(true);
        try {
          const response = await fetch(`https://ventum-internship-backend.bis-apps.com/api/main-laboratorian-purchase-orders/set-status-to-verified/${item.docEntry}/by-docnum/${item.docNum}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              params
            }),
          });

          if (!response.ok) {
            throw new Error('Ошибка при получении данных');
          }

          const data = await response.json();
          toast({
            title: 'Успешно!',
            description: 'Amal muvaffaqiyatli bajarildi .',
            status: 'success',
            isClosable: true,
          });



        } catch (error) {
          setError(error.message);
        } finally {
          setLoadingSearch(false);
        }
      };


      fetchButton(params)
    }

    //Ruxsat emas
    const handleRuxsatEmas = (params) => {
      const fetchEndButton = async (params) => {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Пользователь не авторизован');
          return;
        }

        setLoadingSearch(true);
        try {
          const response = await fetch(`https://ventum-internship-backend.bis-apps.com/api/main-laboratorian-purchase-orders/set-status-rejected/${item.docEntry}/by-docnum/${item.docNum}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              params
            }),
          });

          if (!response.ok) {
            throw new Error('Ошибка при получении данных');
          }

          const data = await response.json();
          toast({
            title: 'Успешно! Завершить',
            description: 'Amal muvaffaqiyatli bajarildi .',
            status: 'success',
            isClosable: true,
          });



        } catch (error) {
          setError(error.message);
        } finally {
          setLoadingSearch(false);
        }
      };


      fetchEndButton(params)
    }


    //Qaytarilsin
    const handleQaytatekshirilsin = (params) => {

      const fetchEndButton = async (params) => {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Пользователь не авторизован');
          return;
        }

        setLoadingSearch(true);
        try {
          const response = await fetch(`https://ventum-internship-backend.bis-apps.com/api/main-laboratorian-purchase-orders/set-status-re-checking/${item.docEntry}/by-docnum/${item.docNum}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              params
            }),
          });

          if (!response.ok) {
            throw new Error('Ошибка при получении данных');
          }

          const data = await response.json();
          toast({
            title: 'Успешно! Завершить',
            description: 'Amal muvaffaqiyatli bajarildi .',
            status: 'success',
            isClosable: true,
          });



        } catch (error) {
          setError(error.message);
        } finally {
          setLoadingSearch(false);
        }
      };


      fetchEndButton(params)
    }

    return (
      <div className='modal_flex'>

        <div>
          <h2>cardName:{item.cardName}</h2>
          <h2>docDate: {format(new Date(item.docDate), 'dd.MM.yyyy')}</h2>
          <h2>docDueDate: {format(new Date(item.docDueDate), 'dd.MM.yyyy')}</h2>
          <h2>docTotal:{item.docTotal}</h2>
          <h2>docCurrency:{item.docCurrency}</h2>
        </div>

        <div>
          <h2>itemCode:{item.documentLines[0].itemCode}</h2>
          <h2>itemDescription:{item.documentLines[0].itemDescription}</h2>
          <h2>quantity:{item.documentLines[0].quantity}</h2>
          <h2>measureUnit:{item.documentLines[0].measureUnit}</h2>

        </div>

        <Button onClick={() => handleRuxsat(item)} mt="5" colorScheme='green' fontSize="lg" color="white"> Foydalanishga ruxsat</Button>
        <Button onClick={() => handleRuxsatEmas(item)} mt="5" colorScheme='red' fontSize="lg" color="white">Foydalanishga ruxsat emas</Button>
        <Button p="2" onClick={() => handleQaytatekshirilsin(item)} mt="5" colorScheme='yellow' fontSize="lg" color="white"> Qaytatekshirilsin</Button>

      </div>
    )
  }
  return (
    <>
      <Modal isOpen={state.visible} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Документ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {getContent()}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={close}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
