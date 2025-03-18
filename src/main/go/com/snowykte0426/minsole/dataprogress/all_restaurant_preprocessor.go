package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
)

func main() {
	filePath := "data/all_restaurant_sheet.xlsx"
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		fmt.Println("Error opening XLSX file:", err)
		return
	}
	defer func(f *excelize.File) {
		if err := f.Close(); err != nil {
			fmt.Println("Error closing XLSX file:", err)
		}
	}(f)
	newFile := excelize.NewFile()
	const maxRowsPerSheet = 500000
	sheetCount := 1
	currentSheetName := fmt.Sprintf("FilteredData%d", sheetCount)
	_, _ = newFile.NewSheet(currentSheetName)
	currentRowNum := 0
	headerWritten := false
	createNewSheet := func() {
		sheetCount++
		currentSheetName = fmt.Sprintf("FilteredData%d", sheetCount)
		_, _ = newFile.NewSheet(currentSheetName)
		currentRowNum = 0
		headerWritten = false
	}
	sheetList := f.GetSheetList()
	for _, sheetName := range sheetList {
		rows, err := f.GetRows(sheetName)
		if err != nil {
			fmt.Printf("Error reading rows in sheet %s: %v\n", sheetName, err)
			continue
		}
		if len(rows) == 0 {
			fmt.Printf("Warning: Sheet %s is empty.\n", sheetName)
			continue
		}
		statusIndex := -1
		for i, col := range rows[0] {
			if col == "상세영업상태명" {
				statusIndex = i
				break
			}
		}
		if statusIndex == -1 {
			fmt.Printf("Warning: '상세영업상태명' column not found in sheet %s\n", sheetName)
			continue
		}
		if !headerWritten {
			currentRowNum++
			for colIdx, colValue := range rows[0] {
				cell := fmt.Sprintf("%s%d", colName(colIdx), currentRowNum)
				_ = newFile.SetCellValue(currentSheetName, cell, colValue)
			}
			headerWritten = true
		}
		for _, row := range rows[1:] {
			if len(row) > statusIndex && row[statusIndex] == "영업" {
				currentRowNum++
				if currentRowNum > maxRowsPerSheet {
					createNewSheet()
					currentRowNum++
					for colIdx, colValue := range rows[0] {
						cell := fmt.Sprintf("%s%d", colName(colIdx), currentRowNum)
						_ = newFile.SetCellValue(currentSheetName, cell, colValue)
					}
					currentRowNum++
				}
				for colIdx, value := range row {
					cell := fmt.Sprintf("%s%d", colName(colIdx), currentRowNum)
					_ = newFile.SetCellValue(currentSheetName, cell, value)
				}
			}
		}
	}
	outputFilePath := "result/all_restaurant_filtered_data.xlsx"
	err = newFile.SaveAs(outputFilePath)
	if err != nil {
		fmt.Println("Error saving XLSX file:", err)
		return
	}
	fmt.Println("Filtered data saved to:", outputFilePath)
}

func colName(index int) string {
	result := ""
	for index >= 0 {
		result = string(rune('A'+(index%26))) + result
		index = index/26 - 1
	}
	return result
}
