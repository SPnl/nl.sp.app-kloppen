<?php

include 'PHPExcel/PHPExcel.php';
include 'PHPMailer/class.phpmailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array('result' => 'Error: Request method must be POST.'));
    exit();
} else {

    //header('Content-Type: application/vnd.ms-excel');
    //header('Content-Disposition: attachment; filename="download.xlsx"');

    $postData = json_decode(file_get_contents('php://input'), true);

    if (!isset($postData['recipient'])) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('result' => 'Error: No E-mail address posted.'));
        exit();
    } else {

        $objPHPExcel = new PHPExcel();

        $objPHPExcel->getProperties()->setCreator("Klop Klop app");

        $workSheet = $objPHPExcel->getActiveSheet();

        $workSheet->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
        $workSheet->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);

        $headerRow = array(
            'Tijdstip',
            'Gemeente',
            'Straatnaam',
            'Huisnummer',
            'Toevoeging',
            'Uitkomst',
            'Voornaam',
            'Achternaam',
            'Telefoon',
            'E-mail',
            'Opmerkingen'
        );

        $workSheet->fromArray($headerRow, NULL, 'A1');

        $currentRow = 2;

        //go through the posted items
        foreach ($postData['results'] as $result) {

            $workSheet->setCellValueExplicit('A' . $currentRow, (isset($result['timeStamp']) ? $result['timeStamp'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('B' . $currentRow, (isset($result['municipality']) ? $result['municipality'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('C' . $currentRow, (isset($result['streetName']) ? $result['streetName'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('D' . $currentRow, (isset($result['houseNumber']) ? $result['houseNumber'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('E' . $currentRow, (isset($result['houseNumberAddon']) ? $result['houseNumberAddon'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('F' . $currentRow, (isset($result['outcome']) ? $result['outcome'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('G' . $currentRow, (isset($result['firstName']) ? $result['firstName'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('H' . $currentRow, (isset($result['lastName']) ? $result['lastName'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('I' . $currentRow, (isset($result['phone']) ? $result['phone'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('J' . $currentRow, (isset($result['email']) ? $result['email'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);
            $workSheet->setCellValueExplicit('K' . $currentRow, (isset($result['notes']) ? $result['notes'] : ''), PHPExcel_Cell_DataType::TYPE_STRING);

            $currentRow++;
        }

        $objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
        $objWriter->save('files/' . $postData['timeSent'] . '.xlsx');
        //$objWriter->save('php://output');

        $email = new PHPMailer();
        $email->From      = 'bvvliet@sp.nl';
        $email->FromName  = 'Klop Klop';
        $email->Subject   = 'Jouw verzamelde gegevens [' . $postData['timeSent'] . ']';
        $email->Body      =
            'Hoi,' . "\r\n" . "\r\n" .
            'Zie bijlage voor de verzamelde gegevens.' . "\r\n" . "\r\n" .
            'Groet!'
            ;
        $email->AddAddress($postData['recipient']);

        $email->AddAttachment('files/' . $postData['timeSent'] . '.xlsx');

        if ($email->Send()) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('result' => 'Mail verzonden naar: ' . $postData['recipient']));
            exit();
        } else {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('result' => 'Error: ' . $email->ErrorInfo));
            exit();
        }
    }

}