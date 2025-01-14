/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { EuiGlobalToastList, Toast } from '@elastic/eui';

import React from 'react';
import * as Rx from 'rxjs';

interface Props {
  toasts$: Rx.Observable<Toast[]>;
  dismissToast: (t: Toast) => void;
}

interface State {
  toasts: Toast[];
}

export class GlobalToastListw extends React.Component<Props, State> {
  public state: State = {
    toasts: []
  };

  private subscription?: Rx.Subscription;

  public componentDidMount() {
    this.subscription = this.props.toasts$.subscribe(toasts => {
      this.setState({ toasts });
    });
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public render() {
    const increaseTime = ((this.state || {}).toasts || []).some(
      item => item.color === 'danger'
    );

    return (
      <EuiGlobalToastList
        toasts={this.state.toasts}
        dismissToast={this.props.dismissToast}
        toastLifeTimeMs={increaseTime ? 30000 : 6000}
      />
    );
  }
}
