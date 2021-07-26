import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ListPages  } from 'app/system/navigation'
import { Main } from 'app/module/main/view/Main'
import { AboutProject } from 'app/module/main/view/AboutProject'
import { AboutLaboratory } from 'app/module/main/view/AboutLaboratory'
import { ListNotification } from 'app/module/main/view/ListNotification'
import { SearchProduct } from 'app/module/main/view/SearchProduct'
import { SearchManufacturer } from 'app/module/main/view/SearchManufacturer'
import { ScanProduct } from 'app/module/main/view/ScanProduct'
import { BarcodeSearchResults } from 'app/module/main/view/BarcodeSearchResults'
import { ResultResearch } from 'app/module/main/view/ResultResearch'
import { ScannedProduct } from 'app/module/main/view/ScannedProduct'
import { LocalResearch } from 'app/module/main/view/LocalResearch'
import { Help } from 'app/module/main/view/Help'

const Stack = createStackNavigator()

export const RootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={ListPages.Main} component={Main} />
      <Stack.Screen name={ListPages.AboutProject} component={AboutProject} />
      <Stack.Screen name={ListPages.AboutLaboratory} component={AboutLaboratory} />
      <Stack.Screen name={ListPages.ListNotification} component={ListNotification} />
      <Stack.Screen name={ListPages.SearchProduct} component={SearchProduct} />
      <Stack.Screen name={ListPages.SearchManufacturer} component={SearchManufacturer} />
      <Stack.Screen name={ListPages.ScanProduct} component={ScanProduct} />
      <Stack.Screen name={ListPages.BarcodeSearchResults} component={BarcodeSearchResults} />
      <Stack.Screen name={ListPages.ResultResearch} component={ResultResearch} />
      <Stack.Screen name={ListPages.ScannedProduct} component={ScannedProduct} />
      <Stack.Screen name={ListPages.LocalResearch} component={LocalResearch} />
      <Stack.Screen name={ListPages.Help} component={Help} />
    </Stack.Navigator>
  )
}
