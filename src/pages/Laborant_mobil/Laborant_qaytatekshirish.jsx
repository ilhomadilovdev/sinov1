import { Button, Center, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useModalControl } from "../../shared/lib/use-modal-control.js";
import { format } from 'date-fns';


function Laborant_qaytatekshirish() {


  const [data, setData] = useState([]);
  const [loading, setIsloading] = useState(false);
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Пользователь не авторизован');
        return;
      }
      setIsloading(true)
      try {
        const response = await fetch('https://ventum-internship-backend.bis-apps.com/api/laboratorian-purchase-orders/by-status/7/pagination/0', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        setData(data?.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsloading(false)
      }
    };

    fetchData();
  }, [])


  const detailsModalControl = useModalControl()

  const handleClickDetails = (item) => {
    detailsModalControl.open({ item })
  }


  return (
    <div>
      <Text mt="4" color='blue' fontSize={"xl"}>Qayta tekshiruv|Перепроверка</Text>

      <div>
        {loading ? (
          <Center mt="4">
            <Spinner size="xl" />
          </Center>
        ) : error ? (<Text>{error}</Text>) : (
          <TableContainer mt="4" maxWidth={"980"}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>N</Th>
                  <Th>docNum</Th>
                  <Th>cardCode</Th>
                  <Th>cardName</Th>
                  <Th>docDate</Th>
                  <Th>docDueDate</Th>
                  <Th>timer</Th>
                  <Th>Description</Th>

                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={index} >
                    <Td>{index + 1}</Td>
                    <Td>{item.docNum}</Td>
                    <Td>{item.cardCode}</Td>
                    <Td>{item.cardName}</Td>
                    <Td> {format(new Date(item.docDate), 'dd.MM.yyyy')}</Td>
                    <Td> {format(new Date(item.docDueDate), 'dd.MM.yyyy')}</Td>
                    <Td>{item.timer1}</Td>
                    <Td>{item.documentLines[0].itemDescription}</Td>

                    <Td>
                      <Button color={"white"} colorScheme='blue' onClick={() => handleClickDetails(item)}>
                        Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

        )}
      </div>


      <Details modalControl={detailsModalControl} />

    </div>
  )
}

export default Laborant_qaytatekshirish



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

    //Начать
    const handleButton = (params) => {
      const fetchButton = async (params) => {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Пользователь не авторизован');
          return;
        }

        setLoadingSearch(true);
        try {
          const response = await fetch(`https://ventum-internship-backend.bis-apps.com/api/laboratorian-purchase-orders/started-re-checking-process/docentry/${item.docEntry}`, {
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

    //Завершит
    const handleButtonEnd = (params) => {
      const fetchEndButton = async (params) => {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Пользователь не авторизован');
          return;
        }

        setLoadingSearch(true);
        try {
          const response = await fetch(`https://ventum-internship-backend.bis-apps.com/api/laboratorian-purchase-orders/from-retest-to-chief-under-review-process/${item.docEntry}/docnum/${item.docNum}`, {
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
        <Flex gap="5">
          <Button onClick={() => handleButton(item)} mt="5" colorScheme='green' fontSize="lg" color="white">Начать</Button>
          <Button onClick={() => handleButtonEnd(item)} mt="5" colorScheme='red' fontSize="lg" color="white">Завершить</Button>
        </Flex>
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
